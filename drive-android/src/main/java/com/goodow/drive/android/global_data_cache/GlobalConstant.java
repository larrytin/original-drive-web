package com.goodow.drive.android.global_data_cache;

public final class GlobalConstant {
	public static enum SupportResTypeEnum {
		DOC("doc"), PDF("pdf"), MP3("mp3"), MP4("mp4"), FLASH("swf"), TEXT(
				"txt"), PNG("png");
		private final String typeName;

		private SupportResTypeEnum(String typeName) {
			this.typeName = typeName;
		}

		public String getTypeName() {
			return typeName;
		}
	}

	public static enum DownloadStatusEnum {
		WAITING("waiting"), DOWNLOADING("downloading"), COMPLETE("complete");

		private final String status;

		private DownloadStatusEnum(String status) {
			this.status = status;
		}

		public String getStatus() {
			return status;
		}
	}

	public static enum DocumentIdAndDataKey {
		FAVORITESDOCID("favorites"), LESSONDOCID("lesson"), REMOTECONTROLDOCID("remotecontrol"), OFFLINEDOCID(
				"offline"), FOLDERSKEY("folders"), FILESKEY("files"), OFFLINEKEY(
				"offline"), CURRENTPATHKEY("currentpath"), CURRENTDOCIDKEY(
				"currentdocid"), PATHKEY("path");

		private final String value;

		private DocumentIdAndDataKey(String value) {
			this.value = value;
		}

		public String getValue() {
			return value;
		}

	}

	private GlobalConstant() {

	}
}
