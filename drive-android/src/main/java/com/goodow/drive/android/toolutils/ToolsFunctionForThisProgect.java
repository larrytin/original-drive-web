package com.goodow.drive.android.toolutils;

import com.goodow.drive.android.R;
import com.goodow.drive.android.global_data_cache.GlobalConstant;

import android.R.integer;

import android.text.TextUtils;

/**
 * 这里只放置, 在当前项目中会被用到的方法
 * 
 * @author zhihua.tang
 */
public final class ToolsFunctionForThisProgect {
  private static String TAG = "ToolsFunctionForThisProgect";

  public static int getFileIconByFileFullName(final String fileFullName) {
    int resId = R.drawable.ic_type_file;

    do {
      if (TextUtils.isEmpty(fileFullName)) {
        break;
      }

      int suffixIndex = fileFullName.lastIndexOf(".");

      if (suffixIndex < 0) {
        resId = R.drawable.ic_type_folder;
      } else {
        String suffixOfFile = fileFullName.substring(suffixIndex + 1);
        if (suffixOfFile.equals(GlobalConstant.SupportResTypeEnum.DOC.getTypeName())) {
          resId = R.drawable.ic_type_doc;
        } else if (suffixOfFile.equals(GlobalConstant.SupportResTypeEnum.PDF.getTypeName())) {
          resId = R.drawable.ic_type_pdf;
        } else if (suffixOfFile.equals(GlobalConstant.SupportResTypeEnum.MP3.getTypeName())) {
          resId = R.drawable.ic_type_audio;
        } else if (suffixOfFile.equals(GlobalConstant.SupportResTypeEnum.MP4.getTypeName())) {
          resId = R.drawable.ic_type_video;
        } else if (suffixOfFile.equals(GlobalConstant.SupportResTypeEnum.FLASH.getTypeName())) {
          resId = R.drawable.ic_type_video;
        } else if (suffixOfFile.equals(GlobalConstant.SupportResTypeEnum.TEXT.getTypeName())) {
          resId = R.drawable.ic_type_doc;
        } else if (suffixOfFile.equals(GlobalConstant.SupportResTypeEnum.PNG.getTypeName())) {
          resId = R.drawable.ic_type_drawing;
        }
      }

      // 有效的资源类型
      return resId;
    } while (false);

    // 无效的资源
    return resId;

  }

  private ToolsFunctionForThisProgect() {

  }
}
