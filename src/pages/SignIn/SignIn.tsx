import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FieldErrors } from "react-hook-form";

import { authApi } from "@/routes/auth.api";
import { artitstApi } from "@/routes/artists.api";

// MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { snackBar } from "@/utils/snackBar";

import { useAuthStore } from "@/zustand/authStore";

type TSignInFormData = {
	loginField: string;
	password: string;
};

const SignIn = () => {
	const { setAuth, auth } = useAuthStore();

	const navigate = useNavigate();

	const { register, handleSubmit, reset } = useForm<TSignInFormData>({
		mode: "onSubmit",
		defaultValues: {
			loginField: "test@mail.ru",
			password: "fucking_password",
		},
	});

	const [color, setColor] = useState<"primary" | "error">("primary");

	const onSubmit = async (data: TSignInFormData) => {
		try {
			const { loginField, password } = data;

			const res = loginField.includes("@")
				? await authApi.loginViaEmail(loginField, password)
				: await authApi.loginViaUsername(loginField, password);

			if (res.status === 200) {
				setAuth(res);
				reset();
			}

			navigate("/projects");
		} catch (err) {
			snackBar("Invalid data for login", "error");
		}
	};

	const onError = (errors: FieldErrors<TSignInFormData>) => {
		Object.values(errors).forEach((err) => {
			snackBar(err.message!, "error");
		});

		setColor("error");
		setTimeout(() => setColor("primary"), 1000);
	};
	return (
		<div className="signup" style={{ width: "100%", height: "100%" }}>
			<div className="signup-wrapper" style={{ position: "relative" }}>
				<form
					className="signup-form"
					onSubmit={handleSubmit(onSubmit, onError)}
				>
					<div className="signup-form-input-wrapper">
						<label className="signup-form-input-label">
							<u>Username or email: </u>
						</label>
						<TextField
							className="signup-form-input-field"
							{...register("loginField", {
								required: "Username or email is required",
							})}
							placeholder="Enter your user_name or email"
							sx={{
								"& .MuiInputBase-input": {
									color: "#FFF",
								},
							}}
						/>
					</div>
					<div className="signup-form-input-wrapper">
						<label className="signup-form-input-label">
							<u>Password: </u>
						</label>

						<TextField
							className="signup-form-input-field"
							{...register("password", {
								required: "Password is required",
							})}
							type="password"
							placeholder="Password"
							sx={{
								"& .MuiInputBase-input": {
									color: "#FFF",
								},
							}}
						/>
					</div>
					<Button
						color={color}
						style={{ transition: "all 0.3s ease-in-out" }}
						type="submit"
						value="Register"
						variant="contained"
					>
						Sign in
					</Button>
				</form>
				<p
					className="sign-in-button"
					onClick={() => navigate("/signup")}
				>
					<u>Sign up</u>
				</p>
			</div>
		</div>
	);
};

export default SignIn;
