import TelegramAuth from "@/components/TelegramAuth/TelegramAuth";

const Signup = () => {
	return (
		<div className="signup" style={{ width: "100%", height: "100%" }}>
			<div className="signup-form">
				<TelegramAuth />
			</div>
		</div>
	);
};

export default Signup;
