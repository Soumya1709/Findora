import User from "../models/User.js";
export const updateProfile =async (req, res) => {
    try {
      const {
        fullName,
        phoneNumber,
        studentId,
      } = req.body;

      const user =
        await User.findByIdAndUpdate(
          req.user.userId,
          {
            fullName,
            phoneNumber,
            studentId,
          },
          { new: true }
        );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };