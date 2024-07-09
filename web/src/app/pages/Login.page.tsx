import { Login } from '../components/Login/Login';

export function LoginPage(tryLoginAs: 'student' | 'sponsor' | 'alumni' | 'admin') {
    tryLoginAs = 'student';
    return <Login tryLoginAs = {tryLoginAs} />;
}