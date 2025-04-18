const { Review, Product, Variant, Order, User } = require("@models");
const mongoose = require("mongoose");
const paginate = require("@utils/pagination");
const ApiError = require("@utils/ApiError");

const reviewService = {
  /**
   * Lấy danh sách đánh giá của một sản phẩm
   * @param {String} productId - ID sản phẩm
   * @param {Object} query - Các tham số truy vấn
   * @returns {Object} - Danh sách đánh giá phân trang
   */
  getProductReviews: async (productId, query = {}) => {
    const { page = 1, limit = 10, rating, sort = "createdAt_desc" } = query;

    // Xây dựng điều kiện lọc
    const filter = {
      product: productId,
      isActive: true,
      deletedAt: null,
    };

    // Lọc theo số sao đánh giá
    if (rating && !isNaN(rating)) {
      filter.rating = parseInt(rating);
    }

    // Xây dựng thông tin sắp xếp
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOptions[field] = order === "desc" ? -1 : 1;
    }

    // Thực hiện truy vấn với phân trang
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      populate: [
        { path: "user", select: "name avatar" },
        {
          path: "variant",
          select: "color",
          populate: { path: "color", select: "name code type colors" },
        },
      ],
    };

    const result = await paginate(Review, filter, options);

    return {
      success: true,
      ...result,
    };
  },

  /**
   * Lấy chi tiết đánh giá
   * @param {String} reviewId - ID đánh giá
   * @returns {Object} - Chi tiết đánh giá
   */
  getReviewDetail: async (reviewId) => {
    const review = await Review.findOne({
      _id: reviewId,
      isActive: true,
      deletedAt: null,
    }).populate([
      { path: "user", select: "name avatar" },
      { path: "product", select: "name slug images" },
      {
        path: "variant",
        select: "color",
        populate: { path: "color", select: "name code type colors" },
      },
    ]);

    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá");
    }

    return {
      success: true,
      review,
    };
  },

  /**
   * Tạo đánh giá mới
   * @param {String} userId - ID của người dùng
   * @param {Object} reviewData - Dữ liệu đánh giá
   * @returns {Object} - Đánh giá đã tạo
   */
  createReview: async (userId, reviewData) => {
    // Kiểm tra đơn hàng và xác thực mua hàng
    const order = await Order.findOne({
      _id: reviewData.orderId,
      user: userId,
      "orderItems.variant": reviewData.variantId,
      status: "delivered",
    });

    if (!order) {
      throw new ApiError(400, "Bạn chỉ có thể đánh giá sản phẩm đã mua");
    }

    // Kiểm tra người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({
      user: userId,
      product: reviewData.productId,
      variant: reviewData.variantId,
      deletedAt: null,
    });

    if (existingReview) {
      throw new ApiError(400, "Bạn đã đánh giá sản phẩm này rồi");
    }

    // Kiểm tra sản phẩm và biến thể tồn tại
    const product = await Product.findById(reviewData.productId);
    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    const variant = await Variant.findById(reviewData.variantId);
    if (!variant) {
      throw new ApiError(404, "Không tìm thấy biến thể sản phẩm");
    }

    // Kiểm tra giới hạn ảnh (tối đa 5 ảnh)
    if (reviewData.images && reviewData.images.length > 5) {
      throw new ApiError(400, "Mỗi đánh giá chỉ được phép có tối đa 5 ảnh");
    }

    // Tạo đánh giá mới
    const newReview = new Review({
      user: userId,
      product: reviewData.productId,
      variant: reviewData.variantId,
      order: reviewData.orderId,
      rating: reviewData.rating,
      content: reviewData.content,
      images: reviewData.images || [],
      isVerifiedPurchase: true,
    });

    await newReview.save();

    return {
      success: true,
      message: "Đánh giá sản phẩm thành công",
      review: await Review.findById(newReview._id).populate([
        { path: "user", select: "name avatar" },
        {
          path: "variant",
          select: "color",
          populate: { path: "color", select: "name code type colors" },
        },
      ]),
    };
  },

  /**
   * Kiểm tra quyền sở hữu review
   * @param {String} userId - ID của người dùng
   * @param {String} reviewId - ID của đánh giá
   * @returns {Object} - Review object nếu người dùng là chủ sở hữu
   */
  checkReviewOwnership: async (userId, reviewId) => {
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
      deletedAt: null,
    });

    if (!review) {
      throw new ApiError(
        403,
        "Bạn không có quyền thực hiện thao tác này với đánh giá"
      );
    }

    return review;
  },

  /**
   * Cập nhật đánh giá
   * @param {String} userId - ID của người dùng
   * @param {String} reviewId - ID của đánh giá
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Object} - Đánh giá đã cập nhật
   */
  updateReview: async (userId, reviewId, updateData) => {
    // Kiểm tra đánh giá tồn tại và thuộc về người dùng
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
      deletedAt: null,
    });

    if (!review) {
      throw new ApiError(
        404,
        "Không tìm thấy đánh giá hoặc bạn không có quyền cập nhật"
      );
    }

    // Những trường được phép cập nhật
    const allowedFields = ["rating", "content", "images"];
    const updateFields = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });

    // Xử lý ảnh mới nếu có
    if (updateData.newImages && updateData.newImages.length > 0) {
      // Kết hợp ảnh mới với ảnh hiện tại
      const currentImages = review.images || [];
      const combinedImages = [...currentImages, ...updateData.newImages];

      // Kiểm tra số lượng ảnh (tối đa 5)
      if (combinedImages.length > 5) {
        throw new ApiError(400, "Tổng số ảnh không được vượt quá 5 ảnh");
      }

      updateFields.images = combinedImages;
    }

    // Cập nhật đánh giá
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate([
      { path: "user", select: "name avatar" },
      {
        path: "variant",
        select: "color",
        populate: { path: "color", select: "name code type colors" },
      },
    ]);

    return {
      success: true,
      message: "Cập nhật đánh giá thành công",
      review: updatedReview,
    };
  },

  /**
   * Xóa đánh giá (xóa mềm)
   * @param {String} userId - ID của người dùng
   * @param {String} reviewId - ID của đánh giá
   * @returns {Object} - Kết quả xóa
   */
  deleteReview: async (userId, reviewId) => {
    // Kiểm tra đánh giá tồn tại và thuộc về người dùng
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
      deletedAt: null,
    });

    if (!review) {
      throw new ApiError(
        404,
        "Không tìm thấy đánh giá hoặc bạn không có quyền xóa"
      );
    }

    // Xóa mềm đánh giá
    await Review.findByIdAndUpdate(reviewId, {
      $set: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return {
      success: true,
      message: "Xóa đánh giá thành công",
    };
  },

  /**
   * Thích/bỏ thích đánh giá
   * @param {String} userId - ID của người dùng
   * @param {String} reviewId - ID của đánh giá
   * @returns {Object} - Kết quả thích/bỏ thích
   */
  toggleLikeReview: async (userId, reviewId) => {
    // Kiểm tra đánh giá tồn tại
    const review = await Review.findOne({
      _id: reviewId,
      isActive: true,
      deletedAt: null,
    });

    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá");
    }

    // Kiểm tra xem người dùng đã thích đánh giá này chưa
    const hasLiked = review.likes.includes(userId);

    if (hasLiked) {
      // Nếu đã thích, bỏ thích
      await Review.findByIdAndUpdate(reviewId, {
        $pull: { likes: userId },
      });
      return {
        success: true,
        message: "Đã bỏ thích đánh giá",
        liked: false,
      };
    } else {
      // Nếu chưa thích, thêm thích
      await Review.findByIdAndUpdate(reviewId, {
        $addToSet: { likes: userId },
      });
      return {
        success: true,
        message: "Đã thích đánh giá",
        liked: true,
      };
    }
  },

  /**
   * Lấy danh sách đánh giá của người dùng
   * @param {String} userId - ID người dùng
   * @param {Object} query - Các tham số truy vấn
   * @returns {Object} - Danh sách đánh giá phân trang
   */
  getUserReviews: async (userId, query = {}) => {
    const { page = 1, limit = 10, sort = "createdAt_desc" } = query;

    // Xây dựng điều kiện lọc
    const filter = {
      user: userId,
      deletedAt: null,
    };

    // Xây dựng thông tin sắp xếp
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOptions[field] = order === "desc" ? -1 : 1;
    }

    // Thực hiện truy vấn với phân trang
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      populate: [
        { path: "product", select: "name slug images" },
        {
          path: "variant",
          select: "color",
          populate: { path: "color", select: "name code type colors" },
        },
      ],
    };

    const result = await paginate(Review, filter, options);

    return {
      success: true,
      ...result,
    };
  },
};

/**
 * ADMIN REVIEW SERVICE - Quản lý đánh giá
 */
const adminReviewService = {
  /**
   * Lấy danh sách tất cả đánh giá
   * @param {Object} query - Các tham số truy vấn và phân trang
   * @returns {Object} - Danh sách đánh giá phân trang
   */
  getAllReviews: async (query = {}) => {
    const {
      page = 1,
      limit = 10,
      productId,
      userId,
      rating,
      isVerifiedPurchase,
      isActive,
      showDeleted,
      sort = "createdAt_desc",
    } = query;

    // Xây dựng điều kiện lọc
    const filter = {};

    if (productId) {
      filter.product = productId;
    }

    if (userId) {
      filter.user = userId;
    }

    if (rating && !isNaN(rating)) {
      filter.rating = parseInt(rating);
    }

    if (isVerifiedPurchase !== undefined) {
      filter.isVerifiedPurchase =
        isVerifiedPurchase === "true" || isVerifiedPurchase === true;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true" || isActive === true;
    }

    // Hiển thị cả đánh giá đã xóa mềm nếu được chỉ định
    if (showDeleted !== "true" && showDeleted !== true) {
      filter.deletedAt = null;
    }

    // Xây dựng thông tin sắp xếp
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOptions[field] = order === "desc" ? -1 : 1;
    }

    // Thực hiện truy vấn với phân trang
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      populate: [
        { path: "user", select: "name email avatar" },
        { path: "product", select: "name slug images" },
        {
          path: "variant",
          select: "color",
          populate: { path: "color", select: "name code type colors" },
        },
        { path: "deletedBy", select: "name email" },
      ],
    };

    const result = await paginate(Review, filter, options);

    return {
      success: true,
      ...result,
    };
  },

  /**
   * Lấy chi tiết đánh giá (bao gồm cả đánh giá đã xóa)
   * @param {String} reviewId - ID đánh giá
   * @returns {Object} - Chi tiết đánh giá
   */
  getReviewById: async (reviewId) => {
    const review = await Review.findById(reviewId).populate([
      { path: "user", select: "name email avatar" },
      { path: "product", select: "name slug images" },
      {
        path: "variant",
        select: "color",
        populate: { path: "color", select: "name code type colors" },
      },
      { path: "order", select: "orderNumber totalAmount status" },
      { path: "deletedBy", select: "name email" },
    ]);

    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá");
    }

    return {
      success: true,
      review,
    };
  },

  /**
   * Ẩn/hiện đánh giá
   * @param {String} reviewId - ID đánh giá
   * @param {Boolean} isActive - Trạng thái đánh giá (true: hiện, false: ẩn)
   * @returns {Object} - Kết quả cập nhật
   */
  toggleReviewVisibility: async (reviewId, isActive) => {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá");
    }

    // Không thể kích hoạt lại đánh giá đã xóa mềm
    if (review.deletedAt && isActive) {
      throw new ApiError(400, "Không thể kích hoạt đánh giá đã xóa");
    }

    review.isActive = isActive;
    await review.save();

    const status = isActive ? "hiển thị" : "ẩn";
    return {
      success: true,
      message: `Đã ${status} đánh giá thành công`,
      review,
    };
  },

  /**
   * Khôi phục đánh giá đã xóa mềm
   * @param {String} reviewId - ID đánh giá
   * @returns {Object} - Kết quả khôi phục
   */
  restoreReview: async (reviewId) => {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá");
    }

    if (!review.deletedAt) {
      throw new ApiError(400, "Đánh giá chưa bị xóa");
    }

    review.deletedAt = null;
    review.deletedBy = null;
    await review.save();

    return {
      success: true,
      message: "Khôi phục đánh giá thành công",
      review,
    };
  },

  /**
   * Thống kê đánh giá theo sản phẩm
   * @param {String} productId - ID sản phẩm
   * @returns {Object} - Thống kê đánh giá
   */
  getProductReviewStats: async (productId) => {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    // Tính thống kê đánh giá
    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isActive: true,
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          verifiedPurchases: {
            $sum: { $cond: [{ $eq: ["$isVerifiedPurchase", true] }, 1, 0] },
          },
          ratingCounts: {
            $push: "$rating",
          },
        },
      },
    ]);

    // Mặc định nếu không có đánh giá
    let result = {
      totalReviews: 0,
      avgRating: 0,
      verifiedPurchases: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    if (stats.length > 0) {
      // Tính phân bố đánh giá
      const ratingDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      if (stats[0].ratingCounts) {
        stats[0].ratingCounts.forEach((rating) => {
          ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
        });
      }

      result = {
        totalReviews: stats[0].totalReviews,
        avgRating: Math.round(stats[0].avgRating * 10) / 10,
        verifiedPurchases: stats[0].verifiedPurchases,
        ratingDistribution,
      };
    }

    return {
      success: true,
      stats: result,
    };
  },
};

// Kết hợp services để export
const exportedReviewService = {
  ...reviewService,
  adminReviewService,
};

module.exports = exportedReviewService;
