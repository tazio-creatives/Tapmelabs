const { Op } = require("sequelize");
const { Product } = require("../models");

// ── POST /api/products ────────────────────────────────────────────────────────

async function createProduct(req, res, next) {
  try {
    const {
      name,
      slug,
      price,
      sale_price,
      short_description,
      full_description,
      images,
      front_image,
      back_image,
      allow_color_customization,
      status,
    } = req.body;

    if (!name || !slug || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "name, slug, and price are required.",
        data: null,
      });
    }

    const existing = await Product.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A product with this slug already exists.",
        data: null,
      });
    }

    const product = await Product.create({
      name,
      slug,
      price,
      sale_price: sale_price ?? null,
      short_description: short_description ?? null,
      full_description: full_description ?? null,
      images: images ?? [],
      front_image: front_image ?? null,
      back_image: back_image ?? null,
      allow_color_customization: allow_color_customization ?? false,
      status: status ?? "draft",
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: { product },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/products ─────────────────────────────────────────────────────────

async function getAllProducts(req, res, next) {
  try {
    const { search, all } = req.query;

    const where = all === "true" ? {} : { status: "active" };

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: term } },
        { short_description: { [Op.iLike]: term } },
      ];
    }

    const products = await Product.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: { products, count: products.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/products/:slug ───────────────────────────────────────────────────

async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, status: "active" },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: { product },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/products/:id ─────────────────────────────────────────────────────

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    const {
      name,
      slug,
      price,
      sale_price,
      short_description,
      full_description,
      images,
      front_image,
      back_image,
      allow_color_customization,
      status,
    } = req.body;

    // If slug is being changed, check it isn't already taken by another product
    if (slug && slug !== product.slug) {
      const slugTaken = await Product.findOne({
        where: { slug, id: { [Op.ne]: product.id } },
      });
      if (slugTaken) {
        return res.status(409).json({
          success: false,
          message: "A product with this slug already exists.",
          data: null,
        });
      }
    }

    await product.update({
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(price !== undefined && { price }),
      ...(sale_price !== undefined && { sale_price }),
      ...(short_description !== undefined && { short_description }),
      ...(full_description !== undefined && { full_description }),
      ...(images !== undefined && { images }),
      ...(front_image !== undefined && { front_image }),
      ...(back_image !== undefined && { back_image }),
      ...(allow_color_customization !== undefined && { allow_color_customization }),
      ...(status !== undefined && { status }),
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: { product },
    });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/products/:id ──────────────────────────────────────────────────

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    // "draft" is used as the soft-delete state — the model ENUM is
    // (active, draft, out_of_stock) and does not include "inactive".
    // GET /api/products only returns status="active", so draft acts as hidden.
    await product.update({ status: "draft" });

    return res.status(200).json({
      success: true,
      message: "Product deactivated successfully.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
