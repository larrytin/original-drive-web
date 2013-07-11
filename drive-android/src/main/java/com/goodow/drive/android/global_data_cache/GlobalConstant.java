package com.goodow.drive.android.global_data_cache;

public final class GlobalConstant {
  public static enum SupportResTypeEnum {
    DOC("doc"), PDF("pdf"), MP3("mp3"), MP4("mp4"), FLASH("swf"), TEXT("txt"), PNG("png");
    private final String typeName;

    private SupportResTypeEnum(String typeName) {
      this.typeName = typeName;
    }

    public String getTypeName() {
      return typeName;
    }
  }

  private GlobalConstant() {

  }
}
