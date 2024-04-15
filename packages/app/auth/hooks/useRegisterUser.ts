import { queryTrpc } from 'app/trpc';
import { useSessionSignIn } from './useSessionSignIn';
import { useRouter } from 'app/hooks/router';
interface UseRegisterUserReturn {
  registerUser: (data: any) => void;
}

export const useRegisterUser = (): UseRegisterUserReturn => {
  const { mutateAsync: signUp } = queryTrpc.signUp.useMutation();
  const sessionSignIn = useSessionSignIn();
  const router = useRouter();

  const registerUser: UseRegisterUserReturn['registerUser'] = (data) => {
    signUp(data)
      .then((user) => {
        if (!user.token) {
          return router.push('/sign-in');
        }

        sessionSignIn(user);
      })
      .catch(() => {});
  };

  return { registerUser };
};
