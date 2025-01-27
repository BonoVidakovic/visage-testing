export type Auth = {
    username?: string;
    isLoggedIn: boolean;
    logout: () => void;
    login: (username: string, password: string) => Promise<{ isError: boolean }>;
}