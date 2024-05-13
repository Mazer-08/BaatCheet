import { React } from 'react'
import { SparklesCore } from "../components/ui/sparkles";
import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { toggle } from '../features/authStageSlice'

const Auth = () => {

    const dispatch = useDispatch();
    const authStage = useSelector((state) => state.authStage.value);
    const authStageMsg = useSelector((state) => state.authStage.text);
    const authStageCmd = useSelector((state) => state.authStage.authCmd);

    const toggleAuthStage = ()=> dispatch(toggle(authStage))

  return (
    <div className='h-screen'>
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full z-5 absolute"
          particleColor="#FFFFFF"
        />
        <div className="flex flex-col gap-y-2 w-2/3 mx-auto pt-10 items-center justify-center text-[#FFF5EA] z-10">
            {!authStage && <div className="register flex flex-col">
                <h1 className="text-center text-lg">Register</h1>
                <div className="form">
                    <Input mt={2} mb={2} p={4} fontSize="0.75em" placeholder='Name' />
                    <Input mb={2} p={4} fontSize="0.75em" placeholder='Email' />
                    <Input mb={2} p={4} fontSize="0.75em" type='password' placeholder='Password' />
                    <Input mb={2} p={4} fontSize="0.75em" type='password' placeholder='Re-enter Password' />
                </div>
            </div>}
            {authStage && <div className="login flex flex-col">
                <h1 className="text-center text-lg">Login</h1>
                <div className="form">
                    <Input mt={2} mb={2} p={4} fontSize="0.75em" placeholder='Username' />  
                    <Input mb={2} p={4} fontSize="0.75em" type='password' placeholder='Password' />
                </div>
            </div>}
            <Button 
                fontSize="0.75em"
                colorScheme='blue'
                onClick={toggleAuthStage}
                >{authStageCmd}
            </Button>
            <Button 
                fontSize="0.75em"
                colorScheme='blue'
                onClick={toggleAuthStage}
                >{authStageMsg}
            </Button>
        </div>
        
    </div>
  )
}

export default Auth