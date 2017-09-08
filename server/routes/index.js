const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();

// Use this route to verify the user is authenticated 
// and get credentials. AKA if req.user, you have a session
router.get('/user', (req, res, next) => {
	if(req.user) {
		return res.status(200).json({
			user: req.user,
			authenticated: true
		});
	} else {
		return res.status(401).json({
			error: 'User is not authenticated',
			authenticated: false
		});
	}
});

router.post('/register', (req, res, next) => {
		console.log('/register handler', req.body);
		Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
				if (err) {
					return res.status(500).send({ error : err.message });
				}

				passport.authenticate('local')(req, res, () => {
						req.session.save((err) => {
								if (err) {
										return next(err);
								}

								res.status(200).send('OK');
						});
				});
		});
});


router.post('/login', passport.authenticate('local', { failureRedirect: '/?error=LoginError', failureFlash: true }), (req, res, next) => {
		console.log('/login handler');
		req.session.save((err) => {
				if (err) {
						return next(err);
				}

				res.status(200).send('OK');
		});
});

/*
Example of not using failureRedirect:

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		console.log('/login handler', req.body);

		if (err) { return next(err); }
		if (!user) { return res.status(500).json({ error: 'User not found.' }); }

		req.session.save((err) => {
				if (err) {
						return next(err);
				}

				res.status(200).json({ success: true });
		});
	})(req, res, next);
});
*/

router.get('/logout', (req, res, next) => {
		req.logout();
		req.session.save((err) => {
				if (err) {
						return next(err);
				}
				res.status(200).send('OK');
		});
});

// Use this to test that your API is working
router.get('/ping', (req, res) => {
		res.status(200).send("pong!");
});


/* These routes should be handled on front-end in React, React Router */
/*
router.get('/', (req, res) => {
		res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
		res.render('register', { });
});

router.get('/login', (req, res) => {
		res.render('login', { user : req.user, error : req.flash('error')});
});
*/

module.exports = router;
