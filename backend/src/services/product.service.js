const {Product, Variant, Category, Brand, Order} = require('@models');
const mongoose = require('mongoose');
const paginate = require('@utils/pagination');
const paginateDeleted = require('@utils/paginationDeleted');
const {updateProductStockInfo} = require('@models/product/middlewares');
const ApiError = require('@utils/ApiError');

// Hàm hỗ trợ xử lý các case sắp xếp
const getSortOption = sortParam => {
  let sortOption = {createdAt: -1};
  if (sortParam) {
    switch (sortParam) {
      case 'created_at_asc':
        sortOption = {createdAt: 1};
        break;
      case 'created_at_desc':
        sortOption = {createdAt: -1};
        break;
      case 'name_asc':
        sortOption = {name: 1};
        break;
      case 'name_desc':
        sortOption = {name: -1};
        break;
      default:
        try {
          sortOption = JSON.parse(sortParam);
        } catch (err) {
          sortOption = {createdAt: -1};
        }
        break;
    }
  }
  return sortOption;
};

/**
 * Helper: Tạo biến thể tóm tắt cho các sản phẩm
 */
const createVariantSummary = variants => {
  // Khởi tạo thông tin tóm tắt
  const variantSummary = {
    total: 0,
    active: 0,
    colors: [],
    colorCount: 0,
    sizeCount: 0,
    priceRange: {min: null, max: null, isSinglePrice: true},
    discount: {hasDiscount: false, maxPercent: 0},
  };

  // Tập hợp để lưu trữ các ID duy nhất
  const colorSet = new Set();
  const sizeSet = new Set();

  // Xử lý thông tin từ variants nếu có
  if (variants && variants.length > 0) {
    variantSummary.total = variants.length;

    variants.forEach(variant => {
      // Đếm variants active
      if (variant.isActive) {
        variantSummary.active++;
      }

      // Thu thập thông tin màu sắc
      if (variant.color && variant.color._id) {
        colorSet.add(variant.color._id.toString());
        // Lưu lại thông tin màu để hiển thị
        if (
          !variantSummary.colors.some(
            c => c._id?.toString() === variant.color._id.toString(),
          )
        ) {
          variantSummary.colors.push({
            _id: variant.color._id,
            name: variant.color.name,
            code: variant.color.code,
            type: variant.color.type,
            colors: variant.color.colors || [],
          });
        }
      }

      // Thu thập thông tin kích thước
      if (variant.sizes && Array.isArray(variant.sizes)) {
        variant.sizes.forEach(sizeObj => {
          if (sizeObj.size && sizeObj.size._id) {
            sizeSet.add(sizeObj.size._id.toString());
          }
        });
      }

      // Cập nhật thông tin giá
      if (variant.priceFinal !== undefined) {
        // Cập nhật giá thấp nhất
        if (
          variantSummary.priceRange.min === null ||
          variant.priceFinal < variantSummary.priceRange.min
        ) {
          variantSummary.priceRange.min = variant.priceFinal;
        }

        // Cập nhật giá cao nhất
        if (
          variantSummary.priceRange.max === null ||
          variant.priceFinal > variantSummary.priceRange.max
        ) {
          variantSummary.priceRange.max = variant.priceFinal;
        }
      }

      // Kiểm tra giảm giá
      if (variant.percentDiscount > 0) {
        variantSummary.discount.hasDiscount = true;
        if (variant.percentDiscount > variantSummary.discount.maxPercent) {
          variantSummary.discount.maxPercent = variant.percentDiscount;
        }
      }
    });

    // Cập nhật số lượng màu và kích thước
    variantSummary.colorCount = colorSet.size;
    variantSummary.sizeCount = sizeSet.size;

    // Kiểm tra xem tất cả các biến thể có cùng một mức giá hay không
    variantSummary.priceRange.isSinglePrice =
      variantSummary.priceRange.min === variantSummary.priceRange.max;
  }

  return variantSummary;
};

/**
 * Helper: Chuyển đổi dữ liệu sản phẩm cho Admin
 * - Giữ lại thông tin quản trị
 */
const transformProductForAdmin = product => {
  const productObj = product.toObject ? product.toObject() : {...product};
  return productObj;
};

/**
 * Helper: Chuyển đổi dữ liệu sản phẩm cho Public
 * - Loại bỏ thông tin quản trị nhạy cảm
 */
const transformProductForPublic = product => {
  const productObj = product.toObject ? product.toObject() : {...product};

  // Loại bỏ thông tin nhạy cảm, chỉ giữ lại những gì cần thiết cho client
  const publicData = {
    id: productObj._id,
    name: productObj.name,
    slug: productObj.slug,
    description: productObj.description,
    category: productObj.category
      ? {
          id: productObj.category._id,
          name: productObj.category.name,
        }
      : null,
    brand: productObj.brand
      ? {
          id: productObj.brand._id,
          name: productObj.brand.name,
          logo: productObj.brand.logo?.url,
        }
      : null,
    images: productObj.images,
    rating: productObj.rating,
    numReviews: productObj.numReviews,
    stockStatus: productObj.stockStatus,
    totalQuantity: productObj.totalQuantity,
    isActive: productObj.isActive,
    createdAt: productObj.createdAt,
  };

  // Xử lý variants cho public
  if (productObj.variants && productObj.variants.length > 0) {
    publicData.variants = productObj.variants
      .filter(v => v.isActive)
      .map(variant => ({
        id: variant._id,
        color: {
          id: variant.color?._id,
          name: variant.color?.name,
          code: variant.color?.code,
          type: variant.color?.type,
          colors: variant.color?.colors || [], // Thêm mảng colors vào đây
        },
        price: variant.price,
        percentDiscount: variant.percentDiscount,
        priceFinal: variant.priceFinal,
        gender: variant.gender,
        images: variant.imagesvariant,
        sizes: variant.sizes?.map(size => ({
          id: size._id,
          sizeInfo: size.size
            ? {
                id: size.size._id,
                value: size.size.value,
                description: size.size.description,
              }
            : null,
          quantity: size.quantity,
          sku: size.sku,
          isAvailable: size.isSizeAvailable,
        })),
      }));

    // Tính toán thông tin giá
    const priceInfo = productObj.variants.reduce(
      (info, variant) => {
        if (!info.minPrice || variant.priceFinal < info.minPrice) {
          info.minPrice = variant.priceFinal;
          info.originalPrice = variant.price;
          info.discountPercent = variant.percentDiscount;
        }

        if (variant.percentDiscount > info.maxDiscountPercent) {
          info.maxDiscountPercent = variant.percentDiscount;
        }

        return info;
      },
      {
        minPrice: null,
        originalPrice: null,
        discountPercent: 0,
        maxDiscountPercent: 0,
      },
    );

    publicData.price = priceInfo.minPrice || 0;
    publicData.originalPrice = priceInfo.originalPrice || 0;
    publicData.discountPercent = priceInfo.discountPercent || 0;
    publicData.hasDiscount = priceInfo.discountPercent > 0;
    publicData.maxDiscountPercent = priceInfo.maxDiscountPercent || 0;

    // Tìm ảnh chính
    if (!publicData.images || publicData.images.length === 0) {
      const variantWithImages = productObj.variants.find(
        v => v.imagesvariant && v.imagesvariant.length > 0,
      );

      if (variantWithImages) {
        const mainImage =
          variantWithImages.imagesvariant.find(img => img.isMain) ||
          variantWithImages.imagesvariant[0];
        publicData.mainImage = mainImage.url;
      }
    } else if (publicData.images && publicData.images.length > 0) {
      const mainImage =
        publicData.images.find(img => img.isMain) || publicData.images[0];
      publicData.mainImage = mainImage.url;
    }
  }

  return publicData;
};

/**
 * Helper: Chuyển đổi dữ liệu sản phẩm cho danh sách public
 * - Loại bỏ chi tiết variants, chỉ giữ thông tin tóm tắt
 */
const transformProductForPublicList = product => {
  const publicData = transformProductForPublic(product);

  // Với danh sách, loại bỏ chi tiết variants để giảm kích thước dữ liệu
  if (publicData.variants && publicData.variants.length > 0) {
    // Tạo variantSummary giống như API admin để đồng nhất
    publicData.variantSummary = createVariantSummary(product.variants);
    delete publicData.variants;
  } else {
    // Nếu không có variants, tạo một variantSummary rỗng nhưng đầy đủ cấu trúc
    publicData.variantSummary = {
      total: 0,
      active: 0,
      colors: [],
      colorCount: 0,
      sizeCount: 0,
      priceRange: {min: null, max: null, isSinglePrice: true},
      discount: {hasDiscount: false, maxPercent: 0},
    };
  }

  return publicData;
};

const productService = {
  // === ADMIN API METHODS ===

  /**
   * [ADMIN] Lấy danh sách sản phẩm (có phân trang, filter) kèm thông tin tóm tắt về variants
   * @param {Object} query Tham số truy vấn
   */
  getAdminProducts: async query => {
    const {
      page = 1,
      limit = 10,
      name,
      category,
      brand,
      stockStatus,
      isActive,
      sort,
    } = query;

    const filter = {deletedAt: null}; // Mặc định chỉ lấy chưa xóa

    // Lọc theo tên
    if (name) {
      filter.tenSanPham = {$regex: name, $options: 'i'};
    }
    // Lọc theo danh mục
    if (category) {
      filter.category = mongoose.Types.ObjectId.isValid(category)
        ? new mongoose.Types.ObjectId(String(category))
        : null;
    }

    // Lọc theo thương hiệu
    if (brand) {
      filter.brand = mongoose.Types.ObjectId.isValid(brand)
        ? new mongoose.Types.ObjectId(String(brand))
        : null;
    }
    // Lọc theo trạng thái tồn kho
    if (stockStatus) {
      filter.stockStatus = stockStatus;
    }

    // Lọc theo trạng thái active
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true' || isActive === true;
    }

    const options = {
      page,
      limit,
      sort: sort ? getSortOption(sort) : {createdAt: -1},
      populate: [
        {path: 'category', select: 'name'},
        {path: 'brand', select: 'name logo'},
        // Populate variants với các trường cần thiết cho thông tin tóm tắt
        {
          path: 'variants',
          select:
            'color sizes isActive price priceFinal percentDiscount gender',
          populate: [
            {path: 'color', select: 'name code type colors'},
            {path: 'sizes.size', select: 'value'},
          ],
        },
      ],
    };

    // Lấy kết quả từ database với variants được populate
    const results = await paginate(Product, filter, options);

    // Xử lý kết quả để thêm thông tin tóm tắt về variants
    results.data = results.data.map(product => {
      const productObj = product.toObject ? product.toObject() : {...product};

      // Thêm thông tin tóm tắt về variants
      productObj.variantSummary = createVariantSummary(productObj.variants);

      // Xóa chi tiết variants để giảm dung lượng dữ liệu
      delete productObj.variants;

      return productObj;
    });

    return results;
  },

  /**
   * [ADMIN] Lấy chi tiết sản phẩm theo ID (kèm variants kể cả đã xóa)
   * @param {String} id ID của sản phẩm
   */
  getAdminProductById: async id => {
    // Đầu tiên tìm sản phẩm, bao gồm cả đã xóa mềm
    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate('deletedBy', 'firstName lastName email')
      .setOptions({includeDeleted: true});

    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Tìm tất cả variants của sản phẩm này, bao gồm cả đã xóa
    const variants = await Variant.find({product: id})
      .populate('color', 'name type code colors')
      .populate('sizes.size', 'value description')
      .populate('deletedBy', 'firstName lastName email')
      .setOptions({includeDeleted: true});

    // Gán variants vào product
    product.variants = variants;

    // Tạo thống kê về variants
    const variantStats = {
      total: variants.length,
      active: 0,
      inactive: 0,
      deleted: 0,
    };

    // Thống kê theo trạng thái
    variants.forEach(variant => {
      if (variant.deletedAt) {
        variantStats.deleted++;

        // Thêm thông tin người xóa hiển thị dễ đọc
        if (variant.deletedBy) {
          variant._doc.deletedByInfo = {
            name: `${variant.deletedBy.firstName || ''} ${
              variant.deletedBy.lastName || ''
            }`.trim(),
            email: variant.deletedBy.email,
          };
        }
      } else if (variant.isActive) {
        variantStats.active++;
      } else {
        variantStats.inactive++;
      }
    });

    // Thêm thông tin người xóa sản phẩm (nếu sản phẩm đã bị xóa)
    if (product.deletedAt && product.deletedBy) {
      product._doc.deletedByInfo = {
        name: `${product.deletedBy.firstName || ''} ${
          product.deletedBy.lastName || ''
        }`.trim(),
        email: product.deletedBy.email,
        deletedAt: product.deletedAt,
      };
    }

    // Chuyển đổi product và thêm thống kê
    const productData = transformProductForAdmin(product);
    productData.variantStats = variantStats;

    // Thêm trạng thái xóa
    productData.isDeleted = !!product.deletedAt;

    return {
      success: true,
      product: productData,
    };
  },

  /**
   * [ADMIN] Lấy danh sách sản phẩm đã xóa
   * @param {Object} query Tham số truy vấn
   */
  getDeletedProducts: async query => {
    const {page = 1, limit = 10, name, category, brand, sort} = query;

    const filter = {};

    if (name) {
      filter.name = {$regex: name, $options: 'i'};
    }

    if (category) {
      filter.category = mongoose.Types.ObjectId.isValid(category)
        ? new mongoose.Types.ObjectId(String(category))
        : null;
    }

    if (brand) {
      filter.brand = mongoose.Types.ObjectId.isValid(brand)
        ? new mongoose.Types.ObjectId(String(brand))
        : null;
    }

    const options = {
      page,
      limit,
      sort: sort ? getSortOption(sort) : {deletedAt: -1},
      populate: [
        {path: 'category', select: 'name'},
        {path: 'brand', select: 'name'},
        {path: 'deletedBy', select: 'firstName lastName email'},
      ],
    };

    const results = await paginateDeleted(Product, filter, options);

    // Xử lý thông tin tóm tắt cho các sản phẩm đã xóa
    results.data = results.data.map(product => {
      const productObj = product.toObject ? product.toObject() : {...product};

      // Thêm thông tin về người xóa nếu có
      if (productObj.deletedBy) {
        productObj.deletedByName = `${productObj.deletedBy.firstName || ''} ${
          productObj.deletedBy.lastName || ''
        }`.trim();
        productObj.deletedByEmail = productObj.deletedBy.email;
      }

      return productObj;
    });

    return results;
  },

  /**
   * Tạo sản phẩm mới
   * @param {Object} productData Thông tin sản phẩm
   */
  ccreateProduct: async productData => {
    // Tạo sản phẩm mới với các trường cần thiết
    const product = new Product({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      colors: productData.colors,
    });

    // Lưu sản phẩm
    await product.save();

    return {
      success: true,
      message: 'Tạo sản phẩm thành công',
      product: transformProductForAdmin(product),
    };
  },
  /**
   * Cập nhật thông tin sản phẩm
   * @param {String} id ID sản phẩm
   * @param {Object} updateData Dữ liệu cập nhật
   */
  updateProduct: async (id, updateData) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Kiểm tra nếu cập nhật category
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        throw new ApiError(404, 'Danh mục không tồn tại');
      }
    }

    // Kiểm tra nếu cập nhật brand
    if (updateData.brand) {
      const brandExists = await Brand.findById(updateData.brand);
      if (!brandExists) {
        throw new ApiError(404, 'Thương hiệu không tồn tại');
      }
    }

    // Cập nhật các trường
    const allowedFields = [
      'name',
      'description',
      'category',
      'brand',
      'isActive',
    ];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        product[key] = value;
      }
    }

    // Lưu sản phẩm - các middleware sẽ cập nhật slug nếu tên thay đổi
    await product.save();

    return {
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      product: transformProductForAdmin(product),
    };
  },

  /**
   * Xóa mềm sản phẩm - với kiểm tra ràng buộc đơn hàng
   * @param {String} id ID sản phẩm
   * @param {String} userId ID người xóa
   */
  deleteProduct: async (id, userId) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Kiểm tra xem sản phẩm có đang được sử dụng trong bất kỳ đơn hàng nào
    const hasOrderItems = await Order.exists({
      'orderItems.product': id,
    });

    // Nếu có đơn hàng liên quan, chỉ vô hiệu hóa thay vì xóa
    if (hasOrderItems) {
      // Vô hiệu hóa sản phẩm
      product.isActive = false;
      await product.save();

      // Vô hiệu hóa các biến thể
      await Variant.updateMany({product: id}, {$set: {isActive: false}});

      return {
        success: true,
        message:
          'Sản phẩm đang được sử dụng trong đơn hàng nên đã được vô hiệu hóa thay vì xóa.',
        isDeactivatedInstead: true,
      };
    }

    // Soft delete sản phẩm sử dụng plugin softDelete
    await product.softDelete(userId);

    // Tắt trạng thái active của các variant liên quan
    await Variant.updateMany({product: id}, {$set: {isActive: false}});

    return {
      success: true,
      message: 'Xóa sản phẩm thành công',
      isDeleted: true,
    };
  },

  /**
   * Khôi phục sản phẩm đã xóa - với hỗ trợ khôi phục cascade
   * @param {String} id ID sản phẩm
   * @param {Boolean} restoreVariants Có khôi phục các variant không
   */
  restoreProduct: async (id, restoreVariants = true) => {
    // Khôi phục sản phẩm - middleware sẽ kiểm tra slug trùng lặp và tạo slug mới nếu cần
    const product = await Product.restoreById(id);
    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm để khôi phục');
    }

    // Kích hoạt trạng thái sản phẩm
    product.isActive = true;
    await product.save();

    let restoredVariants = 0;

    // CASCADE RESTORE: Khôi phục các biến thể liên quan
    if (restoreVariants) {
      // Lấy danh sách các biến thể đã xóa của sản phẩm này
      const deletedVariants = await Variant.find({
        product: id,
        deletedAt: {$ne: null},
      }).setOptions({includeDeleted: true});

      // Khôi phục từng biến thể
      for (const variant of deletedVariants) {
        try {
          // Kiểm tra xem có biến thể trùng màu không
          const existingVariant = await Variant.findOne({
            product: id,
            color: variant.color,
            _id: {$ne: variant._id},
            deletedAt: null,
          });

          if (!existingVariant) {
            await Variant.findByIdAndUpdate(variant._id, {
              $set: {
                deletedAt: null,
                isActive: true,
              },
            });
            restoredVariants++;
          }
        } catch (error) {
          console.error(
            `Không thể khôi phục biến thể ${variant._id}:`,
            error.message,
          );
        }
      }

      // Cập nhật thông tin tồn kho
      await updateProductStockInfo(product);
    }

    return {
      success: true,
      message: restoreVariants
        ? `Khôi phục sản phẩm thành công. Đã khôi phục ${restoredVariants} biến thể liên quan.`
        : 'Khôi phục sản phẩm thành công mà không khôi phục các biến thể.',
      product: transformProductForAdmin(product),
      restoredVariants,
    };
  },

  /**
   * Cập nhật trạng thái active của sản phẩm
   * @param {String} id ID sản phẩm
   * @param {Boolean} isActive Trạng thái active
   * @param {Boolean} cascade Cập nhật cả variants
   */
  updateProductStatus: async (id, isActive, cascade = true) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Cập nhật trạng thái product
    product.isActive = isActive;
    await product.save();

    let affectedVariants = 0;

    // CASCADE: Chỉ cập nhật variants khi cascade = true
    if (cascade && product.variants?.length > 0) {
      const result = await Variant.updateMany(
        {product: id, deletedAt: null},
        {$set: {isActive: isActive}},
      );
      affectedVariants = result.modifiedCount;
    }

    const statusMsg = isActive ? 'kích hoạt' : 'vô hiệu hóa';
    return {
      success: true,
      message: cascade
        ? `Sản phẩm đã được ${statusMsg}. Đã ${statusMsg} ${affectedVariants} biến thể liên quan.`
        : `Sản phẩm đã được ${statusMsg} mà không ảnh hưởng đến biến thể.`,
      product: transformProductForAdmin(product),
    };
  },

  /**
   * Cập nhật trạng thái tồn kho của sản phẩm
   * @param {string} id - ID sản phẩm cần cập nhật
   * @returns {Promise<Object>} - Thông tin sản phẩm đã cập nhật
   */
  updateProductStockStatus: async id => {
    // Tìm sản phẩm với variants đã populate
    const product = await Product.findById(id).populate({
      path: 'variants',
      select: 'sizes',
      match: {deletedAt: null, isActive: true},
    });

    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Cập nhật thông tin tồn kho sử dụng hàm từ middleware
    await updateProductStockInfo(product);

    // Lấy sản phẩm đã cập nhật
    const updatedProduct = await Product.findById(id);
    return {
      success: true,
      message: 'Cập nhật trạng thái tồn kho thành công',
      product: transformProductForAdmin(updatedProduct),
    };
  },

  // === PUBLIC API METHODS ===

  /**
   * [PUBLIC] Lấy danh sách sản phẩm với lọc phức tạp (màu, size, giá...)
   * @param {Object} query Tham số truy vấn
   */
  getPublicProducts: async query => {
    const {
      page = 1,
      limit = 18,
      name,
      category,
      brand,
      minPrice,
      maxPrice,
      colors,
      sizes,
      gender,
      sort = 'newest',
    } = query;
    // Chỉ lấy sản phẩm active và chưa xóa
    const filter = {
      isActive: true,
      deletedAt: null,
    };

    // Tìm theo tên
    if (name) {
      filter.name = {$regex: name, $options: 'i'};
    }

    // Tìm theo danh mục
    if (category) {
      filter.category = mongoose.Types.ObjectId.isValid(category)
        ? new mongoose.Types.ObjectId(String(category))
        : null;
    }

    // Tìm theo thương hiệu
    if (brand) {
      filter.brand = mongoose.Types.ObjectId.isValid(brand)
        ? new mongoose.Types.ObjectId(String(brand))
        : null;
    }

    // Thêm bộ lọc nâng cao (màu, size, giá, giới tính)
    const advancedFilter = {};

    // Nếu có lọc theo màu
    if (colors) {
      const colorIds = colors.split(',');
      const validColorIds = colorIds.filter(id =>
        mongoose.Types.ObjectId.isValid(id),
      );

      if (validColorIds.length > 0) {
        advancedFilter['color'] = {
          $in: validColorIds.map(id => new mongoose.Types.ObjectId(id)),
        };
      }
    }

    // Nếu có lọc theo kích thước
    if (sizes) {
      const sizeIds = sizes.split(',');
      const validSizeIds = sizeIds.filter(id =>
        mongoose.Types.ObjectId.isValid(id),
      );

      if (validSizeIds.length > 0) {
        advancedFilter['sizes.size'] = {
          $in: validSizeIds.map(id => new mongoose.Types.ObjectId(id)),
        };
      }
    }

    // Nếu có lọc theo giới tính
    if (gender && ['male', 'female'].includes(gender)) {
      advancedFilter['gender'] = gender;
    }

    // Nếu có lọc theo khoảng giá
    if (minPrice !== undefined || maxPrice !== undefined) {
      advancedFilter['priceFinal'] = {};

      if (minPrice !== undefined) {
        advancedFilter['priceFinal'].$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        advancedFilter['priceFinal'].$lte = Number(maxPrice);
      }
    }

    // Sắp xếp
    let sortOption = {createdAt: -1}; // Mặc định theo mới nhất

    switch (sort) {
      case 'price-asc':
        sortOption = {priceFinal: 1};
        break;
      case 'price-desc':
        sortOption = {priceFinal: -1};
        break;
      case 'popular':
        sortOption = {totalQuantity: -1};
        break;
      case 'rating':
        sortOption = {rating: -1};
        break;
      default:
        sortOption = {createdAt: -1};
    }

    const options = {
      page,
      limit,
      sort: sortOption,
      populate: [
        {path: 'category', select: 'name'},
        {path: 'brand', select: 'name logo'},
        // Thêm populate variants để lấy thông tin giá
        {
          path: 'variants',
          match: {isActive: true, deletedAt: null},
          select:
            'price priceFinal percentDiscount color gender imagesvariant sizes isActive',
          populate: [
            {path: 'color', select: 'name code type colors'},
            {path: 'sizes.size', select: 'value description'},
          ],
        },
      ],
    };

    // Nếu có filter nâng cao, sử dụng lookup aggregation
    if (Object.keys(advancedFilter).length > 0) {
      // Tìm ID của các sản phẩm có variant phù hợp
      const variantMatchingProducts = await Variant.find({
        ...advancedFilter,
        isActive: true,
        deletedAt: null,
      }).distinct('product');

      // Thêm điều kiện vào filter
      if (variantMatchingProducts.length > 0) {
        filter._id = {$in: variantMatchingProducts};
      } else {
        // Nếu không có variant nào phù hợp, trả về kết quả rỗng
        return {
          success: true,
          count: 0,
          total: 0,
          totalPages: 0,
          currentPage: page,
          hasNextPage: false,
          hasPrevPage: false,
          data: [],
        };
      }
    }

    // Lấy kết quả từ database
    const results = await paginate(Product, filter, options);

    // Xử lý kết quả để tối ưu cho client
    results.data = results.data.map(product =>
      transformProductForPublicList(product),
    );
    return results;
  },

  /**
   * [PUBLIC] Lấy chi tiết sản phẩm theo ID
   * @param {String} id ID của sản phẩm
   */
  getPublicProductById: async id => {
    const product = await Product.findOne({
      _id: id,
      isActive: true,
      deletedAt: null,
    }).populate([
      {
        path: 'categories',
        select: 'name slug',
        match: {isActive: true, deletedAt: null},
      },
      {
        path: 'brand',
        select: 'name logo slug',
        match: {isActive: true, deletedAt: null},
      },
      {
        path: 'variants',
        match: {isActive: true, deletedAt: null},
        select:
          'color price priceFinal percentDiscount gender imagesvariant sizes',
        populate: [
          {path: 'color', select: 'name code type colors'},
          {path: 'sizes.size', select: 'value name'},
        ],
      },
    ]);

    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Xử lý thông tin sản phẩm
    return {
      success: true,
      product: transformProductForPublic(product),
    };
  },

  /**
   * [PUBLIC] Lấy chi tiết sản phẩm theo slug
   * @param {String} slug Slug của sản phẩm
   */
  getPublicProductBySlug: async slug => {
    const product = await Product.findOne({
      slug,
      isActive: true,
      deletedAt: null,
    })
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate({
        path: 'variants',
        match: {isActive: true, deletedAt: null},
        populate: [
          {path: 'color', select: 'name type code colors'},
          {path: 'sizes.size', select: 'value description'},
        ],
      });

    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    const result = {
      success: true,
      product: transformProductForPublic(product),
    };

    return result;
  },

  /**
   * [PUBLIC] Lấy sản phẩm nổi bật (theo rating cao)
   * @param {Number} limit Số lượng sản phẩm trả về
   */
  getFeaturedProducts: async (limit = 8) => {
    const products = await Product.find({
      isActive: true,
      deletedAt: null,
      rating: {$gte: 4},
    })
      .sort({rating: -1, numReviews: -1})
      .limit(Number(limit))
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate({
        path: 'variants',
        match: {isActive: true, deletedAt: null},
        select:
          'price priceFinal percentDiscount color imagesvariant sizes isActive',
        populate: [
          {path: 'color', select: 'name code type colors'},
          {path: 'sizes.size', select: 'value description'},
        ],
      });

    const result = {
      success: true,
      products: products.map(transformProductForPublicList),
    };

    return result;
  },

  /**
   * [PUBLIC] Lấy sản phẩm mới nhất
   * @param {Number} limit Số lượng sản phẩm trả về
   */
  getNewArrivals: async (limit = 8) => {
    const products = await Product.find({
      isActive: true,
      deletedAt: null,
    })
      .sort({createdAt: -1})
      .limit(Number(limit))
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate({
        path: 'variants',
        match: {isActive: true, deletedAt: null},
        select:
          'price priceFinal percentDiscount color imagesvariant sizes isActive',
        populate: [
          {path: 'color', select: 'name code type colors'},
          {path: 'sizes.size', select: 'value description'},
        ],
      });

    const result = {
      success: true,
      products: products.map(transformProductForPublicList),
    };

    return result;
  },

  /**
   * [PUBLIC] Lấy sản phẩm bán chạy (dựa trên tổng số lượng đã bán từ đơn hàng)
   * @param {Number} limit Số lượng sản phẩm trả về
   */
  getBestSellers: async (limit = 8) => {
    // 1. Tính tổng số lượng sản phẩm đã bán từ các đơn hàng thành công
    const productSales = await Order.aggregate([
      // Chỉ lấy đơn hàng đã giao hoặc đã xác nhận
      {
        $match: {
          status: {$in: ['delivered', 'confirmed']},
          deletedAt: null,
        },
      },
      // Tách mỗi sản phẩm trong orderItems thành một document riêng
      {$unwind: '$orderItems'},
      // Nhóm theo sản phẩm và tính tổng số lượng đã bán
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: {$sum: '$orderItems.quantity'},
        },
      },
      // Sắp xếp theo số lượng bán giảm dần
      {$sort: {totalSold: -1}},
      // Giới hạn số lượng kết quả
      {$limit: Number(limit)},
    ]);

    // 2. Lấy thông tin chi tiết của những sản phẩm bán chạy
    const productIds = productSales.map(item => item._id);

    if (productIds.length === 0) {
      // Nếu không có dữ liệu bán hàng, lấy sản phẩm mới nhất thay thế
      return await productService.getNewArrivals(limit);
    }

    // Lấy thông tin chi tiết các sản phẩm bán chạy
    const products = await Product.find({
      _id: {$in: productIds},
      isActive: true,
      deletedAt: null,
    })
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate({
        path: 'variants',
        match: {isActive: true, deletedAt: null},
        select:
          'price priceFinal percentDiscount color imagesvariant sizes isActive',
        populate: [
          {path: 'color', select: 'name code type colors'},
          {path: 'sizes.size', select: 'value description'},
        ],
      });

    // 3. Sắp xếp lại đúng thứ tự theo số lượng bán
    // Tạo map để tra cứu nhanh số lượng bán của mỗi sản phẩm
    const salesMap = {};
    productSales.forEach(item => {
      salesMap[item._id.toString()] = item.totalSold;
    });

    // Sắp xếp sản phẩm theo đúng thứ tự số lượng bán
    const sortedProducts = products.sort((a, b) => {
      const aSold = salesMap[a._id.toString()] || 0;
      const bSold = salesMap[b._id.toString()] || 0;
      return bSold - aSold;
    });

    // 4. Chuyển đổi và trả về kết quả
    const result = {
      success: true,
      products: sortedProducts.map(product => {
        const transformedProduct = transformProductForPublicList(product);
        // Thêm thông tin số lượng đã bán vào kết quả để frontend có thể hiển thị
        transformedProduct.totalSold = salesMap[product._id.toString()] || 0;
        return transformedProduct;
      }),
    };

    return result;
  },

  /**
   * [PUBLIC] Lấy sản phẩm liên quan (cùng danh mục)
   * @param {String} id ID sản phẩm
   * @param {Number} limit Số lượng sản phẩm trả về
   */
  getRelatedProducts: async (id, limit = 8) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: {$ne: id},
      isActive: true,
      deletedAt: null,
    })
      .sort({rating: -1})
      .limit(Number(limit))
      .populate('category', 'name')
      .populate('brand', 'name logo')
      .populate({
        path: 'variants',
        match: {isActive: true, deletedAt: null},
        select:
          'price priceFinal percentDiscount color imagesvariant sizes isActive',
        populate: [
          {path: 'color', select: 'name code type colors'},
          {path: 'sizes.size', select: 'value description'},
        ],
      });

    const result = {
      success: true,
      products: relatedProducts.map(transformProductForPublicList),
    };

    return result;
  },
};

module.exports = productService;
