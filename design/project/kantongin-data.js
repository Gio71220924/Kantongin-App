/* Kantongin — shared data model (Bahasa Indonesia / IDR)
   Plain script: exposes window.KANTONGIN so both Babel apps can read it. */
(function () {
  const accounts = [
    { id: 'bca',     name: 'BCA',     kind: 'Rekening Utama',  last4: '7841', balance: 12450000, hue: 218 },
    { id: 'jago',    name: 'Jago',    kind: 'Kantong Harian',  last4: '0925', balance: 6720000,  hue: 28  },
    { id: 'seabank', name: 'SeaBank', kind: 'Tabungan',        last4: '3360', balance: 5300000,  hue: 168 },
    { id: 'bri',     name: 'BRI',     kind: 'Gaji',            last4: '1192', balance: 3180000,  hue: 256 },
  ];

  // category meta — id, label (id), short glyph used by both concepts
  const categories = [
    { id: 'makan',     label: 'Makan & Minum', hue: 18,  glyph: 'food' },
    { id: 'transport', label: 'Transportasi',  hue: 210, glyph: 'car'  },
    { id: 'belanja',   label: 'Belanja',       hue: 286, glyph: 'bag'  },
    { id: 'tagihan',   label: 'Tagihan',       hue: 48,  glyph: 'bolt' },
    { id: 'hiburan',   label: 'Hiburan',       hue: 330, glyph: 'play' },
    { id: 'kesehatan', label: 'Kesehatan',     hue: 150, glyph: 'plus' },
    { id: 'gaji',      label: 'Gaji',          hue: 168, glyph: 'wallet' },
    { id: 'transfer',  label: 'Transfer',      hue: 262, glyph: 'swap' },
  ];

  // Monthly summary (counted: expense excludes internal transfers entirely)
  const summary = { income: 9500000, expense: 4235000, transfer: 3000000, month: 'Juni 2026' };

  // Spending by category (expenses only) — sums to summary.expense
  const byCategory = [
    { id: 'makan',     amount: 1450000 },
    { id: 'belanja',   amount: 980000  },
    { id: 'tagihan',   amount: 750000  },
    { id: 'transport', amount: 620000  },
    { id: 'hiburan',   amount: 285000  },
    { id: 'kesehatan', amount: 150000  },
  ];

  // Spending per account (expenses only)
  const byAccount = [
    { id: 'bca',     amount: 1800000 },
    { id: 'jago',    amount: 1535000 },
    { id: 'seabank', amount: 600000  },
    { id: 'bri',     amount: 300000  },
  ];

  // Monthly budget limits per category (expenses). spent = byCategory amount.
  const budgets = [
    { id: 'makan',     limit: 1800000 },
    { id: 'belanja',   limit: 1000000 },
    { id: 'tagihan',   limit: 800000  },
    { id: 'transport', limit: 700000  },
    { id: 'hiburan',   limit: 400000  },
    { id: 'kesehatan', limit: 300000  },
  ];

  // 6-month trend — expense vs transfer kept in separate series
  const trend = [
    { m: 'Jan', expense: 3850000, transfer: 2000000 },
    { m: 'Feb', expense: 4120000, transfer: 1500000 },
    { m: 'Mar', expense: 3670000, transfer: 3500000 },
    { m: 'Apr', expense: 4580000, transfer: 2500000 },
    { m: 'Mei', expense: 3990000, transfer: 1000000 },
    { m: 'Jun', expense: 4235000, transfer: 3000000 },
  ];

  // Transaction ledger — newest first. types: income | expense | transfer
  const transactions = [
    { id: 't01', type: 'expense',  title: 'Kopi Tuku',          cat: 'makan',     acct: 'jago',    amount: 32000,   date: '2026-06-04', time: '08:24' },
    { id: 't02', type: 'transfer', title: 'Isi kantong harian',  from: 'bca',     to: 'jago',      amount: 1000000, date: '2026-06-04', time: '08:10' },
    { id: 't03', type: 'expense',  title: 'Grab ke kantor',      cat: 'transport', acct: 'jago',    amount: 28000,   date: '2026-06-03', time: '07:52' },
    { id: 't04', type: 'income',   title: 'Gaji Juni',           cat: 'gaji',      acct: 'bri',     amount: 9000000, date: '2026-06-03', time: '00:01' },
    { id: 't05', type: 'expense',  title: 'Tokopedia — sepatu',  cat: 'belanja',   acct: 'bca',     amount: 480000,  date: '2026-06-02', time: '21:15' },
    { id: 't06', type: 'transfer', title: 'Sisihkan tabungan',   from: 'bri',     to: 'seabank',   amount: 1500000, date: '2026-06-02', time: '19:40' },
    { id: 't07', type: 'expense',  title: 'PLN Token',           cat: 'tagihan',   acct: 'bca',     amount: 250000,  date: '2026-06-02', time: '18:02' },
    { id: 't08', type: 'expense',  title: 'Makan siang warteg',  cat: 'makan',     acct: 'jago',    amount: 24000,   date: '2026-06-02', time: '12:30' },
    { id: 't09', type: 'expense',  title: 'Netflix',             cat: 'hiburan',   acct: 'bca',     amount: 186000,  date: '2026-06-01', time: '10:11' },
    { id: 't10', type: 'transfer', title: 'Bayar arisan (titip)',from: 'seabank', to: 'bca',       amount: 500000,  date: '2026-06-01', time: '09:20' },
    { id: 't11', type: 'expense',  title: 'Indomaret',           cat: 'belanja',   acct: 'jago',    amount: 87000,   date: '2026-05-31', time: '20:05' },
    { id: 't12', type: 'income',   title: 'Refund Shopee',       cat: 'belanja',   acct: 'seabank', amount: 120000,  date: '2026-05-31', time: '14:48' },
    { id: 't13', type: 'expense',  title: 'Apotek K-24',         cat: 'kesehatan', acct: 'bca',     amount: 95000,   date: '2026-05-30', time: '16:33' },
    { id: 't14', type: 'expense',  title: 'Gojek antar makanan', cat: 'makan',     acct: 'jago',    amount: 56000,   date: '2026-05-30', time: '12:10' },
    { id: 't15', type: 'expense',  title: 'Bensin Pertamax',     cat: 'transport', acct: 'bca',     amount: 150000,  date: '2026-05-29', time: '08:40' },
    { id: 't16', type: 'income',   title: 'Project freelance',   cat: 'gaji',      acct: 'seabank', amount: 380000,  date: '2026-05-29', time: '11:00' },
  ];

  function formatRp(n, opts) {
    opts = opts || {};
    const sign = n < 0 ? '-' : '';
    const v = Math.abs(Math.round(n));
    const s = v.toLocaleString('id-ID');
    return (opts.noSymbol ? '' : 'Rp') + sign + (opts.noSymbol ? '' : '') + s;
  }
  // "Rp1.234.567"
  function rp(n) { return 'Rp' + Math.abs(Math.round(n)).toLocaleString('id-ID'); }

  function acct(id) { return accounts.find(a => a.id === id); }
  function cat(id) { return categories.find(c => c.id === id); }

  const dayLabels = {
    '2026-06-04': 'Hari ini',
    '2026-06-03': 'Kemarin',
  };
  function dayLabel(d) {
    if (dayLabels[d]) return dayLabels[d];
    const dt = new Date(d + 'T00:00:00');
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return dt.getDate() + ' ' + months[dt.getMonth()];
  }

  window.KANTONGIN = {
    accounts, categories, summary, byCategory, byAccount, budgets, trend, transactions,
    formatRp, rp, acct, cat, dayLabel,
    totalBalance: accounts.reduce((s, a) => s + a.balance, 0),
  };
})();
