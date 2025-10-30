import { redirect } from 'next/navigation';

// Learning: Server Components can use redirect() directly
// This is like Nuxt's navigateTo() in middleware
export default function Home() {
  redirect('/login');
}
