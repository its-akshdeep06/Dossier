import Logo from '@/components/shared/Logo';

export default function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center px-5 py-5 text-white mix-blend-difference md:px-10">
      <Logo />
    </header>
  );
}