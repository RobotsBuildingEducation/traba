import { getAuth, signOut } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/");
    }).catch((error) => {
      // An error happened.
      console.error("Sign out error", error);
    });
  };

  return (
    <Button onClick={handleSignOut}>Sign Out</Button>
  );
};

export default SignOutButton;
