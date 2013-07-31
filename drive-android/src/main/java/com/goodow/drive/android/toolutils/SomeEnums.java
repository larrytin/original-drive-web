package com.goodow.drive.android.toolutils;

public class SomeEnums {
	public static String getMIMEType(String type) {
		String returnString = null;

		for (MIME_TYPE_Table mimeType : MIME_TYPE_Table.values()) {
			if (type.equals(mimeType.getType())) {
				returnString = mimeType.getMimeType();
				
			}
		}

		return returnString;
	}

	public static enum MIME_TYPE_Table {
		RES_3gp("3gp", "video/3gpp"), RES_pdf("pdf", "application/pdf"), RES_png(
				"png", "image/png"), RES_txt("txt", "text/plain"), RES_doc(
				"doc", "application/msword"), RES_xls("xls",
				"application/vnd.ms-excel"), RES_htm("htm", "text/html"), RES_html(
				"html", "text/html"), RES_bmp("bmp", "image/bmp"), RES_gif(
				"gif", "image/gif"), RES_jpg("jpg", "image/jpeg"), RES_java(
				"java", "text/plain"), RES_mp3("mp3", "audio/mp3");

		private final String type;
		private final String mimeType;

		private MIME_TYPE_Table(String type, String mimeType) {
			this.type = type;
			this.mimeType = mimeType;
		}

		public String getType() {
			
			return type;
		}

		public String getMimeType() {
			
			return mimeType;
		}
	}
}
