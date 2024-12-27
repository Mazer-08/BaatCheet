import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// cloudinary
import { Cloudinary } from "@cloudinary/url-gen";

// ui components
import { SparklesCore } from "../components/ui/sparkles";
import { Input, Button, FormControl, FormLabel, useToast } from "@chakra-ui/react";


const Auth = () => {
    //hooks setup
    const navigate = useNavigate();
    const toast = useToast({
        containerStyle: {
        fontSize: "0.75em",
        },
    });

    // authStage variables
    // authstage: to signify wether the user is registering or logging in 0 => register and 1 => login
    const [authStage, setAuthStage] = useState(true);

    // login/signup states
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPW, setLoginPW] = useState("");

    const [signupName, setSignupName] = ("");
    const [signupUsername, setSignupUsername] = ("");
    const [signupEmail, setSignupEmail] = ("");
    const [signupPW, setSignupPW] = ("");
    const [signupRePW, setSignupRePW] = ("");
    const [signupImg, setSignupImg] = ("");

  

    // functions

    // function for authStage Toggling
        const toggleAuthStage = () => setAuthStage(!authStage);

    // function to post image to cloudinary
        // cloudinary setup
        const cld = new Cloudinary({ cloud: { cloudName: "mazer" } });
        // post image to cloudinary
        const postPic = async (pics) => {
            // setPicLoading(true);
            if (pics === undefined) {
                toast({
                    title: "Please Select an Image!",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                return;
            }
            // console.log(pics);
            if (pics.type === "image/jpeg" || pics.type === "image/png") {
                const data = new FormData();
                data.append("file", pics);
                data.append("upload_preset", "BaatCheet");
                data.append("cloud_name", "mazer");
                try {
                    const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/mazer/image/upload",
                    data
                    );
                    dispatch(setSignupImg(response.data.url.toString()));
                } catch (error) {
                    toast({
                        title: "Error in uploading pic.",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                    console.log(error);
                }
            }
        };

    // function for login / signup
    const auth = async (event) => {
        // login
        if (authStage) {
            const loginData = {
                username: loginUsername,
                password: loginPW,
            };
            // console.log("loginInfo:", loginData);
            try {
            let response = await axios.post(
                "http://localhost:5000/api/user/login",
                loginData
            );
            if (response.status === 200) {
                // console.log(response.data);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data._id);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("pic", response.data.pic);
                setLoginUsername("");
                setLoginPW("");
                navigate("/chats");
            }
        } catch (error) {
            console.log("error is" ,error);
            toast({
                title: "Login Failed",
                description: `${error.response.data.errorMsg}`,
                variant: "subtle",
                status: "error",
                duration: 4000,
                isClosable: true,
                w: "100px",
            });
            setLoginPW("");
        }
    }
    // signup
    else {
        if (
            !signupName ||
            !signupUsername ||
            !signupEmail ||
            !signupPW ||
            !signupRePW
        ){
            toast({
                title: "Registration Failed",
                description: `Incomplete Credentials`,
                variant: "subtle",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else if (signupPW !== signupRePW) {
            toast({
                title: "Registration Failed",
                description: `Passwords do not match`,
                variant: "subtle",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            setSignupPW("");
            setSignupRePW("");
        } else {
            const signupData = {
            name: signupName,
            username: signupUsername,
            email: signupEmail,
            password: signupPW,
            pic: signupImg,
            };
            try {
                let response = await axios.post(
                    "http://localhost:5000/api/user/",
                    signupData
                );
                if (response.status === 201) {
                    console.log(response.data);
                    toggleAuthStage();
                    toast({
                        title: "Registration Successful",
                        description: `Login to continue`,
                        variant: "subtle",
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                toast({
                    title: "Registration Failed",
                    description: `${error.response.data.errorMsg}`,
                    variant: "subtle",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
                console.log(error.response.data.errorMsg);
            }
            setSignupName("");
            setSignupUsername("");
            setSignupEmail("");
            setSignupPW("");
            setSignupRePW("");
        } 
    }
};

  return (
    <div className="h-[100vh] w-screen bg-[#111812]">
      	<div className="flex flex-col gap-y-2 h-full w-2/3 mx-auto items-center justify-center text-[#FFF5EA] z-10">
			<SparklesCore
			id="tsparticlesfullpage"
			background="transparent"
			minSize={0.6}
			maxSize={1.4}
			particleDensity={100}
			className="w-full h-full z-5 absolute"
			particleColor="#FFFFFF"
			/>
        {!authStage && (
          	<div className="register flex flex-col pt-10">
				<h1 className="text-center text-lg">Register</h1>
				<div className="form">
					<Input
						mt={2}
						mb={2}
						p={4}
						fontSize="0.75em"
						placeholder="Name"
						value={signupName}
						onChange={(e) => {
                            setSignupName(e.target.value);
						}}
					/>
					<Input
						mb={2}
						p={4}
						fontSize="0.75em"
						placeholder="Username"
						value={signupUsername}
						onChange={(e) => {
                            setSignupUsername(e.target.value);
						}}
					/>
					<Input
						mb={2}
						p={4}
						fontSize="0.75em"
						placeholder="Email"
						value={signupEmail}
						onChange={(e) => {
                            setSignupEmail(e.target.value);
						}}
					/>
					<Input
						mb={2}
						p={4}
						fontSize="0.75em"
						type="password"
						placeholder="Password"
						value={signupPW}
						onChange={(e) => {
                            setSignupPW(e.target.value);
						}}
					/>
					<Input
						mb={2}
						p={4}
						fontSize="0.75em"
						type="password"
						placeholder="Re-enter Password"
						value={signupRePW}
						onChange={(e) => {
                            setSignupRePW(e.target.value);
						}}
					/>
					<FormControl>
						<FormLabel fontSize="0.75em">Choose profile picture.</FormLabel>
						<Input
						type="file"
						accept="images/*"
						onChange={(e) => postPic(e.target.files[0])}
						border="none"
						fontSize="0.75em"
						/>
					</FormControl>
				</div>
          	</div>
        )}
        {authStage && (
          	<div className="login flex flex-col">
				<h1 className="text-center text-lg">Login</h1>
				<div className="form">
					<Input
						mt={2}
						mb={2}
						p={4}
						fontSize="0.75em"
						placeholder="Username"
						value={loginUsername}
						onChange={(e) => {
                            setLoginUsername(e.target.value);
						}}
					/>
					<Input
						mb={2}
						p={4}
						fontSize="0.75em"
						type="password"
						placeholder="Password"
						value={loginPW}
						onChange={(e) => {
                            setLoginPW(e.target.value);
						}}
					/>
				</div>
          	</div>
        )}
        <Button fontSize="0.75em" colorScheme="blue" onClick={() => auth()}>
          {/* {authStageCmd} */
            (authStage)?"Sign In":"Sign Up"
          }
        </Button>
        <Button fontSize="0.75em" colorScheme="blue" onClick={toggleAuthStage}>
          {/* {authStageMsg */
            (authStage)?"New user? Register Here🎯":"Already a user? Sign in"
          }
        </Button>
      </div>
    </div>
  );
};

export default Auth;
