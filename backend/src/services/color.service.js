const { Color } = require("@models");
const paginate = require("@utils/pagination");
const paginateDeleted = require("@utils/paginationDeleted");
const ApiError = require("@utils/ApiError");
// Hàm hỗ trợ xử lý các case sắp xếp
const getSortOption = (sortParam) => {
  let sortOption = { createdAt: -1 };
  if (sortParam) {
    switch (sortParam) {
      case "created_at_asc":
        sortOption = { createdAt: 1 };
        break;
      case "created_at_desc":
        sortOption = { createdAt: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "name_desc":
        sortOption = { name: -1 };
        break;
      default:
        try {
          sortOption = JSON.parse(sortParam);
        } catch (err) {
          sortOption = { createdAt: -1 };
        }
        break;
    }
  }
  return sortOption;
};

const colorService = {
  // === ADMIN API METHODS ===

  /**
   * [ADMIN] Lấy tất cả màu sắc (bao gồm cả đã xóa)
   * @param {Object} query - Các tham số truy vấn
   */
  getAdminColors: async (query) => {
    const { page = 1, limit = 10, name, type, sort } = query;
    const filter = { deletedAt: null }; // Mặc định chỉ lấy các màu chưa xóa

    // Tìm theo tên
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Tìm theo loại
    if (type) {
      filter.type = type;
    }

    const options = {
      page,
      limit,
      sort: sort ? getSortOption(sort) : { createdAt: -1 },
    };

    return await paginate(Color, filter, options);
  },

  /**
   * [ADMIN] Lấy màu sắc theo ID (bao gồm cả đã xóa mềm)
   * @param {string} id - ID của màu sắc
   */
  getAdminColorById: async (id) => {
    // Sử dụng setOptions để bao gồm cả màu đã xóa
    const color = await Color.findById(id).setOptions({
      includeDeleted: true,
    });

    if (!color) {
      throw new ApiError(404, "Không tìm thấy màu sắc");
    }

    return { success: true, color };
  },

  /**
   * [ADMIN] Lấy danh sách màu sắc đã xóa
   * @param {Object} query - Các tham số truy vấn
   */
  getDeletedColors: async (query) => {
    const { page = 1, limit = 10, name, type, sort } = query;

    // Xây dựng query
    const filter = {};

    // Tìm theo tên
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Tìm theo loại
    if (type) {
      filter.type = type;
    }

    const options = {
      page,
      limit,
      sort: sort ? getSortOption(sort) : { deletedAt: -1 },
    };

    return await paginateDeleted(Color, filter, options);
  },

  // === COMMON OPERATIONS ===

  /**
   * Tạo màu sắc mới
   * @param {Object} colorData - Dữ liệu màu sắc
   */
  createColor: async (colorData) => {
    // Kiểm tra xem màu sắc có tồn tại chưa theo tên
    const existingColorName = await Color.findOne({ name: colorData.name });
    if (existingColorName) {
      throw new ApiError(409, "Tên màu đã tồn tại");
    }

    // Kiểm tra trùng mã màu cho màu solid
    if (colorData.type === "solid" && colorData.code) {
      const existingColorCode = await Color.findOne({
        code: colorData.code.toUpperCase(),
        type: "solid",
      });

      if (existingColorCode) {
        throw new ApiError(
          409,
          `Mã màu ${colorData.code} đã được sử dụng bởi màu "${existingColorCode.name}"`
        );
      }
    }

    // Kiểm tra bộ màu trùng lặp khi thêm màu half
    if (
      colorData.type === "half" &&
      Array.isArray(colorData.colors) &&
      colorData.colors.length === 2
    ) {
      // Chuẩn hóa mã màu sang chữ in hoa để so sánh
      const normalizedColors = colorData.colors.map((color) =>
        color.toUpperCase()
      );

      // Tìm tất cả màu half
      const halfColors = await Color.find({ type: "half" });

      // Kiểm tra từng màu half xem có bộ màu giống nhau không
      for (const halfColor of halfColors) {
        if (!halfColor.colors || halfColor.colors.length !== 2) continue;

        const existingColors = halfColor.colors.map((color) =>
          color.toUpperCase()
        );

        // Kiểm tra nếu 2 mảng có cùng các phần tử (không quan tâm thứ tự)
        if (
          (normalizedColors[0] === existingColors[0] &&
            normalizedColors[1] === existingColors[1]) ||
          (normalizedColors[0] === existingColors[1] &&
            normalizedColors[1] === existingColors[0])
        ) {
          throw new ApiError(
            409,
            `Bộ màu này đã được sử dụng bởi màu "${halfColor.name}"`
          );
        }
      }
    }

    // Tạo màu sắc mới
    const color = await Color.create(colorData);

    return {
      success: true,
      message: "Tạo màu sắc thành công",
      color,
    };
  },

  /**
   * Cập nhật màu sắc
   * @param {string} id - ID màu sắc
   * @param {Object} updateData - Dữ liệu cập nhật
   */
  updateColor: async (id, updateData) => {
    // Kiểm tra màu sắc tồn tại
    const color = await Color.findById(id);

    if (!color) {
      throw new ApiError(404, "Không tìm thấy màu sắc");
    }

    // Kiểm tra nếu đang cập nhật tên, xem tên đã tồn tại chưa
    if (updateData.name && updateData.name !== color.name) {
      const existingColor = await Color.findOne({ name: updateData.name });

      if (existingColor) {
        throw new ApiError(409, "Tên màu đã tồn tại");
      }
    }

    // Kiểm tra mã màu trùng lặp khi cập nhật màu solid
    if (updateData.type === "solid" && updateData.code) {
      const existingColorCode = await Color.findOne({
        code: updateData.code.toUpperCase(),
        type: "solid",
        _id: { $ne: id },
      });

      if (existingColorCode) {
        throw new ApiError(
          409,
          `Mã màu ${updateData.code} đã được sử dụng bởi màu "${existingColorCode.name}"`
        );
      }
    }

    // Kiểm tra bộ màu trùng lặp khi cập nhật màu half
    if (
      (updateData.type === "half" ||
        (!updateData.type && color.type === "half")) &&
      Array.isArray(updateData.colors) &&
      updateData.colors.length === 2
    ) {
      // Chuẩn hóa mã màu sang chữ in hoa để so sánh
      const normalizedColors = updateData.colors.map((color) =>
        color.toUpperCase()
      );

      // Tìm tất cả màu half
      const halfColors = await Color.find({
        type: "half",
        _id: { $ne: id },
      });

      // Kiểm tra từng màu half xem có bộ màu giống nhau không
      for (const halfColor of halfColors) {
        if (!halfColor.colors || halfColor.colors.length !== 2) continue;

        const existingColors = halfColor.colors.map((color) =>
          color.toUpperCase()
        );

        // Kiểm tra nếu 2 mảng có cùng các phần tử (không quan tâm thứ tự)
        if (
          (normalizedColors[0] === existingColors[0] &&
            normalizedColors[1] === existingColors[1]) ||
          (normalizedColors[0] === existingColors[1] &&
            normalizedColors[1] === existingColors[0])
        ) {
          throw new ApiError(
            409,
            `Bộ màu này đã được sử dụng bởi màu "${halfColor.name}"`
          );
        }
      }
    }

    // Cập nhật màu sắc
    const updatedColor = await Color.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "Cập nhật màu sắc thành công",
      color: updatedColor,
    };
  },

  /**
   * Xóa mềm màu sắc - với kiểm tra ràng buộc
   * @param {string} id - ID màu sắc
   * @param {string} userId - ID người dùng thực hiện xóa
   */
  deleteColor: async (id, userId) => {
    // Kiểm tra màu sắc tồn tại
    const color = await Color.findById(id);

    if (!color) {
      throw new ApiError(404, "Không tìm thấy màu sắc");
    }

    // Kiểm tra xem màu sắc có được sử dụng trong biến thể nào không
    const variantCount = await Variant.countDocuments({ color: id });

    // Nếu có biến thể liên kết, thông báo lỗi và không cho xóa
    if (variantCount > 0) {
      throw new ApiError(
        409,
        `Màu sắc đang được sử dụng trong ${variantCount} biến thể sản phẩm nên không thể xóa.`
      );
    }

    // Nếu không có biến thể liên kết, tiến hành xóa mềm
    await color.softDelete(userId);

    return {
      success: true,
      message: "Xóa màu sắc thành công",
      isDeleted: true,
    };
  },

  /**
   * Khôi phục màu sắc đã xóa
   * @param {string} id - ID màu sắc
   */
  restoreColor: async (id) => {
    // Sử dụng phương thức tĩnh restoreById từ plugin
    const color = await Color.restoreById(id);

    return {
      success: true,
      message: "Khôi phục màu sắc thành công",
      color,
    };
  },
};

module.exports = colorService;
