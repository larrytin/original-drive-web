package com.goodow.drive.android.global_data_cache;

public final class GlobalConstant {
	public static enum MenuTypeEnum {
		USER_NAME("用户帐户名称"), USER_LESSON_DATA("我的课程"), USER_REMOTE_DATA("我的收藏夹"), USER_OFFLINE_DATA(
				"离线文件");
		// LOCAL_RES("本地资源");
		private final String menuName;

		private MenuTypeEnum(String menuName) {
			this.menuName = menuName;
		}

		public String getMenuName() {
			return menuName;
		}
	}

	public static enum SupportResTypeEnum {
		DOC("doc"), PDF("pdf"), MP3("mp3"), MP4("mp4"), FLASH("swf"), TEXT(
				"txt"), PNG("png"), JPEG("jpg"), EXCEL("xls");
		private final String typeName;

		private SupportResTypeEnum(String typeName) {
			this.typeName = typeName;
		}

		public String getTypeName() {
			return typeName;
		}
	}

	public static enum DownloadStatusEnum {
		WAITING("等待下载"), DOWNLOADING("正在下载"), COMPLETE("下载完成");

		private final String status;

		private DownloadStatusEnum(String status) {
			this.status = status;
		}

		public String getStatus() {
			return status;
		}
	}

	public static enum DocumentIdAndDataKey {
		// 协调文件id
		FAVORITESDOCID("favorites01"),
		//
		LESSONDOCID("lesson01"),
		//
		REMOTECONTROLDOCID("remotecontrol02"),
		//
		OFFLINEDOCID("offlinedoc01"),

		// // 内调文件id
		// FAVORITESDOCID("favorites41"),
		// //
		// LESSONDOCID("lesson41"),
		// //
		// REMOTECONTROLDOCID("remotecontrol41"),
		// //
		// OFFLINEDOCID("offlinedoc41"),

		// 属性key
		FOLDERSKEY("folders"),
		//
		FILESKEY("files"),
		//
		OFFLINEKEY("offline"),
		//
		CURRENTPATHKEY("currentpath"),
		//
		CURRENTDOCIDKEY("currentdocid"),
		//
		PATHKEY("path");

		private final String value;

		private DocumentIdAndDataKey(String value) {
			this.value = value;
		}

		public String getValue() {
			return value;
		}

		public static DocumentIdAndDataKey getEnumWithValue(String value) {
			if (null != value) {
				for (DocumentIdAndDataKey item : DocumentIdAndDataKey.values()) {
					if (item.getValue().equals(value)) {

						return item;
					}
				}
			}

			return null;
		}
	}

	private GlobalConstant() {

	}
}
