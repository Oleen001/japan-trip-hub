import { redirect } from 'next/navigation';

// route planner is merged into the home map (click a pin → route comparison + path)
export default function RoutePage() {
  redirect('/');
}
