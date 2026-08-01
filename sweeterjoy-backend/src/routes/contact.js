const router = require('express').Router();

router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    
    console.log('New contact message:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    return res.json({
      success: true,
      message: 'Message received successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Server error'
    });
  }
});

module.exports = router;