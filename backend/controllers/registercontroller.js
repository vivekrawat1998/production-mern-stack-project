const { hashpassword, comparepassword } = require("../helper/authhelpers");
const Usermodel = require("../models/usermodal");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password,answer, phone, address } = req.body;
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const hashedPassword = await hashpassword(password); 
    const user = await new Usermodel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer
    }).save();

    res.status(200).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in register",
      error: error.message,
    });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New password is required" });
    }

    // Check user's email and security question
    const user = await Usermodel.findOne({ email, answer });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or answer",
      });
    }

    const hashedPassword = await hashpassword(newPassword);
    await Usermodel.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.LoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparepassword(password, user.password); 

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated token:", token);

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};


exports.updateProfileController = async (req, res ) =>{
  try {
    const {email, name, phone, address, password} =req.body
    const user = Usermodel.findById( req.user._id)
    // if(!password && password.length <6 ){
    //   return res.json({error :"password is required and must have 6 character"})
    // }
    const hashedPassword = password ? hashpassword(password) : undefined
    const update = await Usermodel.findByIdAndUpdate(req.user._id, {
      name :name || user.name,
      password:hashedPassword || user.password,
      email:email || user.email,
      address:address || user.address,
      phone:phone || user.phone
    },{new:true})
    res.status(200).send({
      success: true,
      message:"user updated succesfully",
      update
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"error in updating the profile",
      error
    })
  }
}