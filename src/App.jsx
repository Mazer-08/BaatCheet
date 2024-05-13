import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// cloudinary
import { Cloudinary } from "@cloudinary/url-gen";

// ui components
import { SparklesCore } from "./components/ui/sparkles";
import { Input, Button, FormControl, FormLabel, useToast } from "@chakra-ui/react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { toggle } from "./features/authStageSlice";
import { setLoginUsername, setLoginPW } from "./features/loginCredSlice";
import { setSignupName, setSignupUsername, setSignupEmail, setSignupPW, setSignupRePW, setSignupImg } from "./features/signupCredSlice";

const Auth = () => {
  //hooks setup
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast({
    containerStyle: {
      fontSize: "0.75em",
    },
  });

  // cloudinary setup

  // check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/chats");
//     }
//   }, []);

  // redux-variables

  // authStage variables
  const authStage = useSelector((state) => state.authStage.value);
  const authStageMsg = useSelector((state) => state.authStage.text);
  const authStageCmd = useSelector((state) => state.authStage.authCmd);

  // login credentials
  const loginUsername = useSelector((state) => state.loginCred.loginUsername);
  const loginPW = useSelector((state) => state.loginCred.loginPW);

  // signup credentials
  const signupName = useSelector((state) => state.signupCred.signupName);
  const signupUsername = useSelector(
    (state) => state.signupCred.signupUsername
  );
  const signupEmail = useSelector((state) => state.signupCred.signupEmail);
  const signupPW = useSelector((state) => state.signupCred.signupPW);
  const signupRePW = useSelector((state) => state.signupCred.signupRePW);
  const signupImg = useSelector((state) => state.signupCred.signupImg);

  // functions

  // function for authStage Toggling
  const toggleAuthStage = () => dispatch(toggle(authStage));

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
    console.log(pics);
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
          dispatch(setLoginUsername(""));
          dispatch(setLoginPW(""));
          navigate("/chats");
        }
      } catch (error) {
        toast({
          title: "Login Failed front",
          description: `${error.response.data.errorMsg}`,
          variant: "subtle",
          status: "error",
          duration: 4000,
          isClosable: true,
          w: "100px",
        });
        console.log(error);
        dispatch(setLoginPW(""));
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
      ) {
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
        dispatch(setSignupPW(""));
        dispatch(setSignupRePW(""));
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
        dispatch(setSignupName(""));
        dispatch(setSignupUsername(""));
        dispatch(setSignupEmail(""));
        dispatch(setSignupPW(""));
        dispatch(setSignupRePW(""));
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
						dispatch(setSignupName(e.target.value));
						}}
					/>
					<Input
						mb={2}
						p={4}
						fontSize="0.75em"
						placeholder="Username"
						value={signupUsername}
						onChange={(e) => {
						dispatch(setSignupUsername(e.target.value));
						}}
					/>
					<Input
						mb={2}
						p={4}
						fontSize="0.75em"
						placeholder="Email"
						value={signupEmail}
						onChange={(e) => {
						dispatch(setSignupEmail(e.target.value));
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
						dispatch(setSignupPW(e.target.value));
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
						dispatch(setSignupRePW(e.target.value));
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
						dispatch(setLoginUsername(e.target.value));
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
						dispatch(setLoginPW(e.target.value));
						}}
					/>
				</div>
          	</div>
        )}
        <Button fontSize="0.75em" colorScheme="blue" onClick={() => auth()}>
          {authStageCmd}
        </Button>
        <Button fontSize="0.75em" colorScheme="blue" onClick={toggleAuthStage}>
          {authStageMsg}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
