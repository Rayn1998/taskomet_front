import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FieldErrors } from "react-hook-form";

// MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useAuthStore } from "@/zustand/authStore";
import { snackBar } from "@/utils/snackBar";
import { artitstApi } from "@/routes/artists.api";

type TFormData = {
	name: string;
	user_name: string;
	email: string;
	password: string;
};

const Signup = () => {
	const navigate = useNavigate();

	const { setAuth } = useAuthStore();

	const { register, handleSubmit } = useForm<TFormData>({
		mode: "onSubmit",
		defaultValues: {
			email: "test@mail.ru",
			name: "Yuriy",
			user_name: "bodolanov",
			password: "fucking_password",
		},
	});

	const [color, setColor] = useState<"primary" | "error">("primary");

	const onSubmit = async (data: TFormData) => {
		try {
			const user = { role: 1, ...data };
			const newUser = await artitstApi.create(user);
			setAuth(newUser);
			navigate("/projects");
			snackBar(`Welcome, dear ${newUser.name}`);
		} catch (err: any) {
			snackBar(err.message, "error");
		}
	};

	const onError = (errors: FieldErrors<TFormData>) => {
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
							<u>Name: </u>
						</label>
						<TextField
							className="signup-form-input-field"
							{...register("name", {
								required: "Name is required",
							})}
							placeholder="Enter your name"
							sx={{
								"& .MuiInputBase-input": {
									color: "#FFF",
								},
							}}
						/>
					</div>
					<div className="signup-form-input-wrapper">
						<label className="signup-form-input-label">
							<u>Username: </u>
						</label>
						<TextField
							className="signup-form-input-field"
							{...register("user_name", {
								required: "Username is required",
							})}
							placeholder="Enter your user_name"
							sx={{
								"& .MuiInputBase-input": {
									color: "#FFF",
								},
							}}
						/>
					</div>
					<div className="signup-form-input-wrapper">
						<label className="signup-form-input-label">
							<u>Email: </u>
						</label>
						<TextField
							className="signup-form-input-field"
							{...register("email", {
								required: "Email is required",
							})}
							placeholder="Email: example@gmail.com"
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
						Register
					</Button>
				</form>
				<p
					className="sign-in-button"
					onClick={() => navigate("/signin")}
				>
					<u>Sign in</u>
				</p>
			</div>
		</div>
	);
};

export default Signup;
