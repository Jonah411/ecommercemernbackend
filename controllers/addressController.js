const asycHandler = require("express-async-handler");
const Address = require("../models/addressModels");

const getAllAddress = asycHandler(async (req, res) => {
  const user = req.params.id;
  const address = await Address.findOne({ user: user });
  if (address) {
    return res.status(200).json({
      data: address,
    });
  } else {
    return res.status(200).json({
      address: {},
    });
  }
});

const createAddress = asycHandler(async (req, res) => {
  const userId = req.params.id;
  const { address } = req.body;
  Address.findOne({ user: userId })
    .populate("address") // populate the "address" field
    .exec(async (err, addressData) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!addressData) {
        // create a new address if one doesn't exist for the user
        addressData = new Address({
          user: userId,
          address: [], // change "items" to "address"
        });
      }

      const newAddress = await Address.find({});
      const addressIndex = newAddress.findIndex(
        (obj) =>
          addressData.address.some(
            (address) => address._id.toString() === obj._id.toString()
          ) // use obj._id.toString() instead of obj._id
      );
      if (addressIndex === -1) {
        // add a new address to the addressData if the address isn't already in it
        addressData.address.push(address[0]);
      } else {
        // update the address if the address is already in the addressData
        addressData.address[addressIndex] = address[0];
      }
      await addressData.save();
      return res.status(201).json({
        status: true,
        message: "Address added successfully",
        data: addressData.address, // add the addressData.address to the response
      });
    });
});

const updateAddress = asycHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const { address } = req.body;
    Address.findOne({ user: userId })
      .populate("address") // populate the "address" field
      .exec(async (err, addressData) => {
        if (err) {
          console.error(err);
          return;
        }
        if (addressData) {
          const activeAddress = addressData.address.findIndex(
            (address) => address.mainaddress === 1
          );
          if (activeAddress != -1) {
            addressData.address[activeAddress].mainaddress = 0;
            await addressData.save();
          }
          const changeActiveAddress = addressData.address.findIndex(
            (addressId) => addressId._id.toString() === address.toString()
          );
          if (changeActiveAddress != -1) {
            addressData.address[changeActiveAddress].mainaddress = 1;
            await addressData.save();
          }
        }
      });
    return res.status(201).json({
      status: true,
      message: "Address update successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { getAllAddress, createAddress, updateAddress };
