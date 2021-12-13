function sendEmail() {
	Email.send({
	Host: "smtp.gmail.com",
	Username : "spg.p13.polito@gmail.com",
	Password : "spgp13gmail",
	To : 's287949@studenti.polito.it',
	From : "spg.p13.polito@gmail.com",
	Subject : "Order confirmed",
	Body : "Your order has been confirmed.",
	}).then(
		message => alert("mail sent successfully")
	);
}