import { User } from '../models/User.model.js';
import { signToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  ApiResponse.success(
    res,
    {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    },
    'Registered successfully',
    201
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user._id);
  ApiResponse.success(res, {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
};

export const getMe = async (req, res) => {
  ApiResponse.success(res, {
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};
