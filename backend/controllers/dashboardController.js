import User from '../models/User.js';


//  get user profile
export const getProfile = async (req, res) => {
  try {
    const subject = req.user || req.user;
    if (!subject) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(subject._id || subject.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: { id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        Budget: user.budgets,
        Transaction: user.Transactions,
        preferences: user.preferences },
    });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
  }
};


//    Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updates = (({ name, email, phone, }) => ({ name, email, phone }))(req.body);
  const subject = req.user || req.user;
  if (!subject) return res.status(404).json({ message: 'User not found' });
  const user = await User.findByIdAndUpdate(subject._id, updates, { new: true });
    res.json({ message: "Profile updated successfully", 
       id: user._id, name: user.name, email: user.email, phone: user.phone
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user profile", error: error.message });
  }
};
//    Delete user account

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found for deletion' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user account', error: err.message });
  }
};

