

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/quan-ly-san-pham',
		name: 'Quản lý sản phẩm',
		icon: 'TableOutlined',
		component: './QuanLySanPham',
	},
	{
		path: '/quan-ly-don-hang',
		name: 'Quản lý đơn hàng',
		icon: 'TableOutlined',
		component: './QuanLyDonHang',
	},
	{
		name: 'Bài tập thực hành số 1',
		path: '/bai-tap-1',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-tap-1/random-number',
				name: 'RandomNumber',
				icon: 'ArrowsAltOutlined',
				component: './RandomNumber',
			},
			{
				path: '/bai-tap-1/quan-ly-hoc-tap',
				name: 'Quản lý học tập',
				icon: 'TableOutlined',
				component: './QuanLyHocTap',
			},
		],
	},
	{

		name: 'Bài tập thực hành số 2',
		path: '/bai-tap-2',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-tap-2/RockPaperSiccor',
				name: 'RockPaperSiccor',
				icon: 'ArrowsAltOutlined',
				component: './RockPaperSiccor',
			},
			{
				path: '/bai-tap-2/QuanLyCauHoi',
				name: 'Quản lý câu hỏi',
				icon: 'TableOutlined',
				component: './QuanLyCauHoi',
			}
		],
	},
	{

		name: 'Bài tập thực hành số 3',
		path: '/bai-tap-3',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-tap-3/khach-hang-dat-lich-hen',
				name: 'Quản lý Lịch hẹn Dịch vụ',
				icon: 'CalendarOutlined',
				component: './Khachhangdatlichhen',
			}
		],
	},
	{
		name: 'Bài tập thực hành số 4',
		path: '/bai-tap-4',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-tap-4/quan-ly-hen-dich-vu',
				name: 'Quản lý Lịch hẹn Dịch vụ',
				icon: 'CalendarOutlined',
				component: './TH04/DiplomaSystem',
			}
		],
	},
	{
		name: 'Bài tập thực hành số 5',
		path: '/bai-tap-5',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-tap-5/danh-sach-clb',
				name: 'Danh sách câu lạc bộ',
				icon: 'TableOutlined',
				component: './TH05/DanhSachCLB',
			},
			{
				path: '/bai-tap-5/quan-ly-don',
				name: 'Quản lý đơn đăng ký',
				icon: 'FileDoneOutlined',
				component: './TH05/QuanLyDonDangKy',
			},
			{
				path: '/bai-tap-5/quan-ly-thanh-vien',
				name: 'Quản lý thành viên',
				icon: 'UsergroupAddOutlined',
				component: './TH05/QuanLyThanhVien',
			},
			{
				path: '/bai-tap-5/bao-cao-thong-ke',
				name: 'Báo cáo và thống kê',
				icon: 'BarChartOutlined',
				component: './TH05/BaoCaoThongKe',
			}
		],
	},

	{
		name: 'Bài tập thực hành số 6 (Travel Planner)',
		path: '/bai-tap-6',
		icon: 'CompassOutlined',
		routes: [
			{
				path: '/bai-tap-6/kham-pha',
				name: 'Khám phá điểm đến',
				icon: 'EnvironmentOutlined',
				component: './TH06/KhamPha',
			},
			{
				path: '/bai-tap-6/lich-trinh',
				name: 'Tạo lịch trình',
				icon: 'CalendarOutlined',
				component: './TH06/LichTrinh',
			},
			{
				path: '/bai-tap-6/ngan-sach',
				name: 'Quản lý ngân sách',
				icon: 'PieChartOutlined',
				component: './TH06/NganSach',
			},
			{
				path: '/bai-tap-6/admin',
				name: 'Trang quản trị (Admin)',
				icon: 'SettingOutlined',
				component: './TH06/Admin',
			}
		],
	},
	{
		name: 'Bài tập kiểm tra giữa kỳ',
		path: '/bai-kiem-tra-giua-ky',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-kiem-tra-giua-ky/quan-ly-khoa-hoc',
				name: 'Quản lý khóa học',
				icon: 'TableOutlined',
				component: './KTGK/DanhSachKhoaHoc',
			},
		],
	},
	{
		name: 'Bài tập thực hành số 7 (Blog)',
		path: '/TH07',
		icon: 'ReadOutlined',
		routes: [
			{
				path: '/TH07/home',
				name: 'Trang chủ Blog',
				icon: 'HomeOutlined',
				component: './TH07/Home',
			},
			{
				path: '/TH07/post/:id',
				name: 'Chi tiết bài viết',
				hideInMenu: true,
				component: './TH07/PostDetail',
			},
			{
				path: '/TH07/about',
				name: 'Giới thiệu',
				icon: 'UserOutlined',
				component: './TH07/About',
			},
			{
				path: '/TH07/admin',
				name: 'Quản lý',
				icon: 'SettingOutlined',
				routes: [
					{
						path: '/TH07/admin/posts',
						name: 'Quản lý bài viết',
						icon: 'FileTextOutlined',
						component: './TH07/AdminPosts',
					},
					{
						path: '/TH07/admin/tags',
						name: 'Quản lý thẻ (Tag)',
						icon: 'TagsOutlined',
						component: './TH07/AdminTags',
					},
				],
			},
		],
	},
	{
		name: 'Bài tập thực hành số 8 (Fitness Tracker)',
		path: '/TH08',
		icon: 'HeartOutlined',
		routes: [
			{
				path: '/TH08/dashboard',
				name: 'Dashboard',
				icon: 'DashboardOutlined',
				component: './TH08/Dashboard',
			},
			{
				path: '/TH08/workouts',
				name: 'Nhật ký tập luyện',
				icon: 'ThunderboltOutlined',
				component: './TH08/Workouts',
			},
			{
				path: '/TH08/health',
				name: 'Nhật ký chỉ số sức khỏe',
				icon: 'HeartOutlined',
				component: './TH08/HealthLogs',
			},
			{
				path: '/TH08/goals',
				name: 'Quản lý mục tiêu',
				icon: 'FlagOutlined',
				component: './TH08/Goals',
			},
			{
				path: '/TH08/exercises',
				name: 'Thư viện bài tập',
				icon: 'BookOutlined',
				component: './TH08/Exercises',
			},
		],
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: '/notification/subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: '/notification/check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: '/notification',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
		redirect: '/dashboard',
		hideInMenu: true,
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '*',
		component: './exception/404',
		hideInMenu: true,
	},
];


