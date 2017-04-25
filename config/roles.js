

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg','You must be logged in');
		res.redirect('/');
	}
}

function ensureAdmin(req, res, next){
	if(req.isAuthenticated()){
		console.log(req.user);
		if(req.user.role == 1){
			return next();
		}else{
			req.flash('error_msg','Sorry, You are not allowed to access this page');
			res.redirect('/');
		}		
	}else{
		req.flash('error_msg','You must be logged in');
		res.redirect('/');
	}
}


module.exports = {
	auth:ensureAuthenticated,
	admin:ensureAdmin
};