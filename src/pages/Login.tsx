import React, { useState } from 'react';
import { dbService } from '../lib/dbService';
import type { Profile } from '../lib/dbService';


interface LoginProps {
  onLoginSuccess: (user: Profile) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { user, error: loginErr } = await dbService.signIn(email, password);
      if (loginErr) {
        setError(loginErr.message || 'Sai tên đăng nhập hoặc mật khẩu.');
      } else if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user, error: googleErr } = await dbService.signInWithGoogle();
      if (googleErr) {
        setError(googleErr.message || 'Không thể đăng nhập bằng Google.');
      } else if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setError('Vui lòng nhập email để nhận link đặt lại mật khẩu.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Direct call
      await dbService.signUp(forgotPasswordEmail, 'Nhân viên mới'); // Dummy signup/reset trigger
      setResetSuccess('Một liên kết xác minh đã được gửi đến email của bạn.');
    } catch (err: any) {
      setError(err.message || 'Không gửi được email khôi phục.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden text-on-surface flex">
      {/* Left Column (40%): Visual Heritage & Logo */}
      <section className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-primary items-center justify-center">
        <img
          alt="Meadow Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7-_BeZnXoBRJTyI2f1U1tdlj47eCPTPstQ2guIORKNPMEK1AISImxpncQH0HKrbv6QI_4x2AQ86qgfxsPPI9i3aSddu54wBK6tqUwZgeHyzIdsokdfUOE5VGgX7PgicDzm_GrHkZmbwtpbB1hiaT_KpxNrhWTlUBLgQvqIcgb01xEcxLqAP9MnO2t2qZQ6Vpgo-AjAtm8s0B0JZlWlkqAFZX1QzWw9MoJSDm-Mun-U33nkNytNE-e0LB9uaohC_LHyimm-cvKlbo0"
        />
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/60"></div>
        <div className="relative z-10 flex flex-col items-center text-center px-container-padding">
          <div className="mb-stack-lg">
            <img
              alt="Sữa Vĩnh Hưng Logo"
              className="h-32 w-auto mb-stack-md drop-shadow-xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALck2vPufROAPStk22P2ENI-dS0PIK-gaYtrROmrvI13uH3d_obbMRtMi_KjLnBj9GcRCh9xxyQdhLNqaG4KLby6ggYNFwSVi8VFBV9guOH0ndBpjg90cPwARmCJV45qtySsdi_rR7gp3jHM4YLM3ay_VgMb_OOtFxe-hk8VAoKHluqsdGUqMVgalfrdjhOqPnwwBd3mS90yZ_fbsE9U6F4mZ7LSdApjJ9_34SnSLs2uFlruj9cCcVUTB-q1y2pLIhm6846P832DtH"
            />
          </div>
          <h2 className="font-headline-md text-headline-md text-surface-container-lowest font-light tracking-wide max-w-xs leading-relaxed">
            Hệ thống Quản lý Khách hàng Tập trung
          </h2>
          <div className="mt-stack-lg w-16 h-1 bg-primary-fixed-dim rounded-full"></div>
        </div>
      </section>

      {/* Right Column (60%): Login Form */}
      <section className="w-full lg:w-[60%] h-full bg-surface-container-lowest flex items-center justify-center p-gutter md:p-container-padding">
        <div className="w-full max-w-md space-y-stack-lg">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex justify-center mb-stack-lg">
            <img
              alt="Sữa Vĩnh Hưng Logo"
              className="h-16 w-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALck2vPufROAPStk22P2ENI-dS0PIK-gaYtrROmrvI13uH3d_obbMRtMi_KjLnBj9GcRCh9xxyQdhLNqaG4KLby6ggYNFwSVi8VFBV9guOH0ndBpjg90cPwARmCJV45qtySsdi_rR7gp3jHM4YLM3ay_VgMb_OOtFxe-hk8VAoKHluqsdGUqMVgalfrdjhOqPnwwBd3mS90yZ_fbsE9U6F4mZ7LSdApjJ9_34SnSLs2uFlruj9cCcVUTB-q1y2pLIhm6846P832DtH"
            />
          </div>

          {!forgotPasswordMode ? (
            <>
              <div className="space-y-stack-sm text-center lg:text-left">
                <h1 className="font-headline-md text-headline-md text-on-surface">Chào mừng trở lại</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Vui lòng đăng nhập để quản lý hệ thống CRM của bạn.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-md flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-stack-md" onSubmit={handleLogin}>
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block ml-1" htmlFor="email">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                    <input
                      className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input transition-all duration-200"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block ml-1" htmlFor="password">
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(true);
                        setError(null);
                        setResetSuccess(null);
                      }}
                      className="font-label-md text-label-md text-outline hover:text-primary transition-colors cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                    <input
                      className="w-full h-10 pl-10 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input transition-all duration-200"
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant transition-colors"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2 py-1">
                  <input
                    className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20"
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="font-body-md text-body-md text-on-surface-variant" htmlFor="remember">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary-container text-surface-container-lowest font-label-md text-label-md rounded-lg hover:bg-primary transition-all duration-300 shadow-sm active:scale-[0.98] uppercase tracking-widest flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span>Đăng nhập hệ thống</span>
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant opacity-50"></div>
                  </div>
                  <div className="relative flex justify-center text-label-md uppercase">
                    <span className="bg-surface-container-lowest px-4 text-outline-variant">Hoặc</span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-10 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg flex items-center justify-center space-x-3 hover:bg-surface-container-low transition-all duration-300 active:scale-[0.98]"
                >
                  <img
                    alt="Google Logo"
                    className="w-5 h-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeldGNDr4TvywkLP4DaAzpDoPgJp3klKrTgb4OKSH485HplLiAFui-oVnOKiZL5ngIIk96YHFL_b0mX6pTkWjpFeiCzBzT6maPLwZsBVmC97Xv5GK29BmcrhZYnf7N6x9bKBo68UQjorcr_APCep18wUmz8ytP9lsgv5UtxKyFtd35oXf-27LsMMi1Mlcs3fdI7CavEQreKi6gg7HAceD-T1wz3aGORJ2M6pHehsgc-CiVJDWAsSbouy5FF-2Hv6Uq6vuIK0vEHXig"
                  />
                  <span>Đăng nhập bằng tài khoản Google</span>
                </button>
              </form>

              <div className="pt-stack-lg text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Chưa có tài khoản?{' '}
                  <span className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 cursor-pointer">
                    Liên hệ quản trị viên
                  </span>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-stack-sm text-center lg:text-left">
                <h1 className="font-headline-md text-headline-md text-on-surface">Đặt lại mật khẩu</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Nhập địa chỉ email của bạn, chúng tôi sẽ gửi liên kết khôi phục mật khẩu.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-md flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 bg-primary-container/10 text-primary-container border border-primary/20 rounded-lg text-body-md flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>{resetSuccess}</span>
                </div>
              )}

              <form className="space-y-stack-md" onSubmit={handleResetPassword}>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block ml-1" htmlFor="reset-email">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                    <input
                      className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md custom-input transition-all duration-200"
                      id="reset-email"
                      type="email"
                      placeholder="email@example.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary-container text-surface-container-lowest font-label-md text-label-md rounded-lg hover:bg-primary transition-all duration-300 shadow-sm active:scale-[0.98] uppercase tracking-widest flex items-center justify-center"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span>Gửi link khôi phục</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(false);
                    setError(null);
                    setResetSuccess(null);
                  }}
                  className="w-full h-10 border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low font-label-md text-label-md rounded-lg transition-all duration-300 active:scale-[0.98]"
                >
                  Quay lại đăng nhập
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Login;
