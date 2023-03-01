const asycHandler = require("express-async-handler");
const brandBannerHandler = require("../helpers/brandBannerUpload");
const brandHandler = require("../helpers/brandUpload");
const BrandBanner = require("../models/brandBannerModels");
const Brand = require("../models/brandModels");

const getAllBrands = asycHandler(async (req, res) => {
  const brand = await Brand.find({});
  res.status(200).json({
    status: true,
    data: brand,
  });
});

const parseJson = (data) => {
  let field = "json_data";
  var value;
  if (data[field] && typeof data[field] === "string") {
    value = JSON.parse(data[field]);
  }
  return value;
};

const createBrands = asycHandler(async (req, res) => {
  brandHandler(req, res, async (err) => {
    const confiq = parseJson(req.body);
    const { brand_image, brand_banner } = req.files;
    const brandImage = [];
    const bannerImage = [];
    brand_image.map((data) => {
      return brandImage.push(data?.filename);
    });
    brand_banner.map((data) => {
      return bannerImage.push(data?.filename);
    });
    const brand = await Brand.findOne({
      name: confiq.name,
    });
    if (!brand) {
      const singleBrand = await Brand.create({
        name: confiq.name,
        description: confiq.description,
        brand_image: brandImage[0],
        status: 1,
      });
      await BrandBanner.create({
        brand: singleBrand._id,
        name: bannerImage[0],
        status: confiq.banner_status,
      });
      res.status(201).json({ status: false, msg: "Brand add successfully" });
    }
  });
});

const getBrand = asycHandler(async (req, res) => {
  const id = req.params.id;
  const brand = await Brand.findOne({ _id: id });
  res.status(200).json({
    status: true,
    data: brand,
  });
});

const getBrandBanner = asycHandler(async (req, res) => {
  BrandBanner.find({})
    .populate("brand")
    .exec(function (err, brands) {
      if (err) {
        try {
          throw err;
        } catch (error) {
          console.error(error);
        }
      }
      res.status(200).json({
        status: true,
        data: brands,
      });
    });
});

const getActiveBanner = asycHandler(async (req, res) => {
  BrandBanner.find({ status: 1 })
    .populate("brand")
    .exec(function (err, brands) {
      if (err) {
        try {
          throw err;
        } catch (error) {
          console.error(error);
        }
      }
      res.status(200).json({
        status: true,
        data: brands,
      });
    });
});

const updateBanner = asycHandler(async (req, res) => {
  const id = req.params.id;
  const brandBanner = await BrandBanner.findOne({ _id: id });
  if (!brandBanner) {
    res.status(400);
    throw new Error("categorie not Found");
  }
  const updatecategorie = await BrandBanner.findByIdAndUpdate(
    id,
    { status: req.body.status },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: true,
    msg: "Update Successfully!",
    banner: updatecategorie,
  });
});

module.exports = {
  getAllBrands,
  createBrands,
  getBrand,
  getBrandBanner,
  updateBanner,
  getActiveBanner,
};
