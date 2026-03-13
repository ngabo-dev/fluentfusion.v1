import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { authApi } from "../app/api/config";

interface Transaction {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  type: "purchase" | "refund" | "payout" | "subscription";
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  description: string;
  created_at: string;
}

interface Payout {
  id: number;
  instructor_id: number;
  instructor_name: string;
  instructor_email: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  processed_at: string | null;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  is_active: boolean;
  subscriber_count: number;
}

interface PromoCode {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  usage_limit: number | null;
  usage_count: number;
  expires_at: string | null;
  is_active: boolean;
}

export default function AdminRevenue() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "payouts" | "subscriptions" | "promos">("overview");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data
      setTransactions([
        {
          id: 1,
          user_id: 101,
          user_name: "John Doe",
          user_email: "john@email.com",
          type: "purchase",
          amount: 29.99,
          currency: "USD",
          status: "completed",
          description: "Pro Plan Subscription",
          created_at: "2024-02-01T10:30:00Z"
        },
        {
          id: 2,
          user_id: 102,
          user_name: "Jane Smith",
          user_email: "jane@email.com",
          type: "purchase",
          amount: 49.99,
          currency: "USD",
          status: "completed",
          description: "Enterprise Plan Subscription",
          created_at: "2024-02-02T14:20:00Z"
        },
        {
          id: 3,
          user_id: 103,
          user_name: "Bob Wilson",
          user_email: "bob@email.com",
          type: "refund",
          amount: -29.99,
          currency: "USD",
          status: "completed",
          description: "Refund - Pro Plan",
          created_at: "2024-02-03T09:15:00Z"
        }
      ]);

      setPayouts([
        {
          id: 1,
          instructor_id: 201,
          instructor_name: "Instructor A",
          instructor_email: "instructor1@email.com",
          amount: 150.00,
          status: "pending",
          created_at: "2024-02-01T08:00:00Z",
          processed_at: null
        },
        {
          id: 2,
          instructor_id: 202,
          instructor_name: "Instructor B",
          instructor_email: "instructor2@email.com",
          amount: 250.50,
          status: "completed",
          created_at: "2024-01-28T10:00:00Z",
          processed_at: "2024-01-30T15:30:00Z"
        }
      ]);

      setPlans([
        {
          id: 1,
          name: "Free",
          price: 0,
          interval: "month",
          features: ["Basic lessons", "Limited practice"],
          is_active: true,
          subscriber_count: 1000
        },
        {
          id: 2,
          name: "Pro",
          price: 29.99,
          interval: "month",
          features: ["All lessons", "Unlimited practice", "Certificates", "Priority support"],
          is_active: true,
          subscriber_count: 250
        },
        {
          id: 3,
          name: "Enterprise",
          price: 49.99,
          interval: "month",
          features: ["Everything in Pro", "1-on-1 tutoring", "Custom learning path", "Team management"],
          is_active: true,
          subscriber_count: 50
        }
      ]);

      setPromos([
        {
          id: 1,
          code: "WELCOME20",
          discount_type: "percentage",
          discount_value: 20,
          usage_limit: 100,
          usage_count: 45,
          expires_at: "2024-03-31T23:59:59Z",
          is_active: true
        },
        {
          id: 2,
          code: "NEWYEAR50",
          discount_type: "fixed",
          discount_value: 50,
          usage_limit: 50,
          usage_count: 50,
          expires_at: "2024-01-31T23:59:59Z",
          is_active: false
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalRevenue = transactions
    .filter(t => t.type === 'purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const pendingPayouts = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const mrr = plans.reduce((sum, p) => sum + (p.price * p.subscriber_count), 0);

  if (loading) {
    return (
      <div className="bg-[var(--bg-primary)] min-h-screen flex items-center justify-center">
        <div className="text-[var(--accent-primary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[var(--border-default)] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[var(--accent-primary)] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-[var(--text-primary)] font-bold">
                FLUENT<span className="text-[var(--accent-primary)]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,0,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[var(--color-danger)] text-[11px] font-semibold">👑 Admin</span>
              </div>
              <button
                onClick={() => {
                  authApi.logout();
                  window.location.href = '/login';
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[260px] h-[calc(100vh-66px)] bg-[var(--bg-primary)] border-r border-[var(--border-default)] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[var(--text-disabled)] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Billing</div>

            <Link to="/admin/revenue" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[var(--accent-primary-muted)] border-l-2 border-[var(--accent-primary)]">
              <span className="text-[var(--accent-primary)]">💰</span>
              <span className="text-[var(--accent-primary)] text-[14px]">Revenue</span>
            </Link>

            <Link to="/admin/payouts" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>💳</span>
              <span className="text-[14px]">Payouts</span>
            </Link>

            <Link to="/admin/subscriptions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>📦</span>
              <span className="text-[14px]">Subscriptions</span>
            </Link>

            <Link to="/admin/promos" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>🏷️</span>
              <span className="text-[14px]">Promo Codes</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[260px] flex-1 p-9">
          <div className="mb-8">
            <h1 className="text-[32px] text-[var(--text-primary)] font-bold">
              <span className="text-[var(--accent-primary)]">Revenue</span> & Billing
            </h1>
            <p className="text-[var(--text-secondary)] text-[14px] mt-1">
              Manage subscriptions, transactions, and payouts
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6">
              <div className="text-[var(--text-secondary)] text-[12px] uppercase">Monthly Revenue</div>
              <div className="text-[32px] text-[var(--text-primary)] font-bold mt-2">${mrr.toFixed(2)}</div>
              <div className="text-[var(--color-success)] text-[12px] mt-2">MRR</div>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6">
              <div className="text-[var(--text-secondary)] text-[12px] uppercase">Total Revenue</div>
              <div className="text-[32px] text-[var(--text-primary)] font-bold mt-2">${totalRevenue.toFixed(2)}</div>
              <div className="text-[var(--text-secondary)] text-[12px] mt-2">All time</div>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6">
              <div className="text-[var(--text-secondary)] text-[12px] uppercase">Pending Payouts</div>
              <div className="text-[32px] text-[var(--text-primary)] font-bold mt-2">${pendingPayouts.toFixed(2)}</div>
              <div className="text-[var(--color-warning)] text-[12px] mt-2">{payouts.filter(p => p.status === 'pending').length} pending</div>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6">
              <div className="text-[var(--text-secondary)] text-[12px] uppercase">Refunds</div>
              <div className="text-[32px] text-[var(--text-primary)] font-bold mt-2">${totalRefunds.toFixed(2)}</div>
              <div className="text-[var(--color-danger)] text-[12px] mt-2">Total issued</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['overview', 'transactions', 'payouts', 'subscriptions', 'promos'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-[8px] text-sm ${
                  activeTab === tab
                    ? "bg-[var(--accent-primary)] text-black"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'transactions' && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[var(--text-secondary)] text-[12px] uppercase border-b border-[var(--border-default)]">
                      <th className="text-left py-4 px-6">User</th>
                      <th className="text-left py-4 px-6">Type</th>
                      <th className="text-left py-4 px-6">Description</th>
                      <th className="text-left py-4 px-6">Amount</th>
                      <th className="text-left py-4 px-6">Status</th>
                      <th className="text-left py-4 px-6">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-[var(--border-default)]">
                        <td className="py-4 px-6">
                          <div className="text-[var(--text-primary)]">{tx.user_name}</div>
                          <div className="text-[var(--text-tertiary)] text-sm">{tx.user_email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-[4px] text-xs capitalize ${
                            tx.type === 'purchase' ? 'bg-[rgba(0,255,127,0.1)] text-[var(--color-success)]' :
                            tx.type === 'refund' ? 'bg-[rgba(255,0,0,0.1)] text-[var(--color-danger)]' :
                            'bg-[rgba(255,165,0,0.1)] text-[var(--color-warning)]'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[var(--text-primary)]">{tx.description}</td>
                        <td className={`py-4 px-6 font-bold ${tx.amount >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                          {tx.amount >= 0 ? '+' : ''}${tx.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-[4px] text-xs ${
                            tx.status === 'completed' ? 'bg-[rgba(0,255,127,0.1)] text-[var(--color-success)]' :
                            tx.status === 'pending' ? 'bg-[rgba(255,165,0,0.1)] text-[var(--color-warning)]' :
                            'bg-[rgba(255,0,0,0.1)] text-[var(--color-danger)]'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[var(--text-secondary)]">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="grid grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[var(--text-primary)] font-bold text-lg">{plan.name}</h3>
                    <span className={`px-2 py-1 rounded-[4px] text-xs ${plan.is_active ? 'bg-[rgba(0,255,127,0.1)] text-[var(--color-success)]' : 'bg-[rgba(255,0,0,0.1)] text-[var(--color-danger)]'}`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-[32px] text-[var(--text-primary)] font-bold">${plan.price}</span>
                    <span className="text-[var(--text-secondary)]">/{plan.interval}</span>
                  </div>
                  <div className="text-[var(--text-secondary)] text-sm mb-4">{plan.subscriber_count} subscribers</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-[var(--text-primary)] text-sm flex items-center gap-2">
                        <span className="text-[var(--accent-primary)]">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'promos' && (
            <div className="space-y-4">
              {promos.map((promo) => (
                <div key={promo.id} className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[var(--bg-elevated)] px-4 py-2 rounded-[8px]">
                      <span className="text-[var(--accent-primary)] font-bold">{promo.code}</span>
                    </div>
                    <div>
                      <div className="text-[var(--text-primary)] font-medium">
                        {promo.discount_type === 'percentage' ? `${promo.discount_value}% off` : `$${promo.discount_value} off`}
                      </div>
                      <div className="text-[var(--text-secondary)] text-sm">
                        {promo.usage_limit ? `${promo.usage_count}/${promo.usage_limit} used` : `${promo.usage_count} used`}
                        {promo.expires_at && ` • Expires ${new Date(promo.expires_at).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-[99px] text-xs ${promo.is_active ? 'bg-[rgba(0,255,127,0.1)] text-[var(--color-success)]' : 'bg-[rgba(255,0,0,0.1)] text-[var(--color-danger)]'}`}>
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-[var(--text-secondary)] text-[12px] uppercase border-b border-[var(--border-default)]">
                    <th className="text-left py-4 px-6">Instructor</th>
                    <th className="text-left py-4 px-6">Amount</th>
                    <th className="text-left py-4 px-6">Status</th>
                    <th className="text-left py-4 px-6">Requested</th>
                    <th className="text-left py-4 px-6">Processed</th>
                    <th className="text-left py-4 px-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-[var(--border-default)]">
                      <td className="py-4 px-6">
                        <div className="text-[var(--text-primary)]">{payout.instructor_name}</div>
                        <div className="text-[var(--text-tertiary)] text-sm">{payout.instructor_email}</div>
                      </td>
                      <td className="py-4 px-6 text-[var(--text-primary)] font-bold">${payout.amount.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-[4px] text-xs capitalize ${
                          payout.status === 'completed' ? 'bg-[rgba(0,255,127,0.1)] text-[var(--color-success)]' :
                          payout.status === 'pending' ? 'bg-[rgba(255,165,0,0.1)] text-[var(--color-warning)]' :
                          payout.status === 'processing' ? 'bg-[rgba(0,191,255,0.1)] text-[var(--color-info)]' :
                          'bg-[rgba(255,0,0,0.1)] text-[var(--color-danger)]'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--text-secondary)]">
                        {new Date(payout.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-[var(--text-secondary)]">
                        {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-6">
                        {payout.status === 'pending' && (
                          <button className="bg-[var(--accent-primary)] text-black px-4 py-1 rounded-[4px] text-sm font-medium">
                            Process
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6">
                <h3 className="text-[var(--text-primary)] font-bold mb-4">Top Plans</h3>
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between">
                      <span className="text-[var(--text-primary)]">{plan.name}</span>
                      <span className="text-[var(--accent-primary)] font-bold">{plan.subscriber_count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] p-6">
                <h3 className="text-[var(--text-primary)] font-bold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-[var(--text-primary)]">{tx.description}</span>
                        <span className="text-[var(--text-tertiary)] text-sm ml-2">{new Date(tx.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={tx.amount >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>
                        ${Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
