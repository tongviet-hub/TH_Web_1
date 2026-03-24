import path from "path";

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
				component: './Khachhangdatlichhen/pages/TH04/DiplomaSystem',
			}
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
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
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
		component: './exception/404',
	},
];
