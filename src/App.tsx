import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PublicOnlyRoute } from "@/components/auth/public-only-route";
import { useAuthStore } from "@/store/auth-store";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import GymPage from "@/pages/gym";
import PersonalPage from "@/pages/personal";
import ChatPage from "@/pages/chat";
import RoutinePage from "@/pages/routine";
import CalendarPage from "@/pages/calendar";
import FoodScanPage from "@/pages/food-scan";
import WorkPage from "@/pages/work";
import StudyPage from "@/pages/study";
import AnalyticsPage from "@/pages/analytics";
import NotificationsPage from "@/pages/notifications";
import SettingsPage from "@/pages/settings";
import ChoosePlanPage from "@/pages/choose-plan";
import ProfilePage from "@/pages/profile";
import OnboardingPage from "@/pages/onboarding";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import ForgotPasswordPage from "@/pages/forgot-password";
import VerifyEmailPage from "@/pages/verify-email";
import AuthCallbackPage from "@/pages/auth-callback";
import ResetPasswordPage from "@/pages/reset-password";
import WaterPage from "@/pages/water";
import SleepPage from "@/pages/sleep-page";
import StepsPage from "@/pages/steps";
import MoodPage from "@/pages/mood-page";
import RelaxPage from "@/pages/relax";
import AwardsPage from "@/pages/awards";
import TrainingPage from "@/pages/training";
import NotFoundPage from "@/pages/not-found";
import { LocaleSync } from "@/components/i18n/locale-sync";

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  // Rehydrate the session once on mount; ProtectedRoute shows a loader until
  // this resolves (treating any failure as unauthenticated).
  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <>
      <LocaleSync />
      <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected app area */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="food-scan" element={<FoodScanPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="gym" element={<GymPage />} />
        <Route path="sleep" element={<SleepPage />} />
        <Route path="water" element={<WaterPage />} />
        <Route path="steps" element={<StepsPage />} />
        <Route path="mood" element={<MoodPage />} />
        <Route path="relax" element={<RelaxPage />} />
        <Route path="awards" element={<AwardsPage />} />
        <Route path="personal" element={<PersonalPage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="routine" element={<RoutinePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="plans" element={<ChoosePlanPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}
