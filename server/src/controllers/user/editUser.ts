import { UnableToEditUserError } from "../../helpers/errors";
import User from "../../models/userModel";

/**
 * Edits a user.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.userId - The ID of the user to edit.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves to the edited user.
 */
export const editUser = async (req, res,next) => {
    try {
      const { userId } = req.body;
  
      const editedUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
        returnOriginal: false,
      }).populate("favorites");
      res.status(200).json(editedUser);
    } catch (error) {
      next(UnableToEditUserError)
    }
  };