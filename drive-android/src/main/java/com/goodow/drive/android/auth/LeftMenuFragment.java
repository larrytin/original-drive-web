package com.goodow.drive.android.auth;

import com.goodow.drive.android.R;
import com.goodow.drive.android.activity.MainActivity;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import android.app.Activity;
import android.app.FragmentTransaction;
import android.app.ListFragment;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

public class LeftMenuFragment extends ListFragment {
  public static enum MenuTypeEnum {
    USER_NAME("用户帐户名"), USER_REMOTE_DATA("我的资料库"), USER_LOCAL_DATA("本机课件"), USER_DOWNLOADING_DATA("正在下载");
    private final String menuName;

    private MenuTypeEnum(String menuName) {
      this.menuName = menuName;
    }

    public String getMenuName() {
      return menuName;
    }
  }

  private class LeftMenuAdapter extends ArrayAdapter<MenuTypeEnum> {
    /**
     * @param context
     * @param resource
     * @param textViewResourceId
     * @param objects
     */
    public LeftMenuAdapter(Context context, int resource, int textViewResourceId, List<MenuTypeEnum> objects) {
      super(context, resource, textViewResourceId, objects);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
      String path = "https://goodow-realtime.appspot.com/_ah/api/account/v2/login/admin/admin";
      URL url;
      try {
        url = new URL(path);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setReadTimeout(5 * 1000);
        conn.setRequestMethod("GET");
        String abcString = conn.getResponseMessage();
        System.out.println(abcString);
      } catch (Exception e) {
        e.printStackTrace();
      }

      View row = convertView;
      if (null == row) {
        row = ((Activity) this.getContext()).getLayoutInflater().inflate(R.layout.row_leftmenu, parent, false);
      }

      MenuTypeEnum item = getItem(position);
      row.setTag(item);

      ImageView img_left = (ImageView) row.findViewById(R.id.leftImage_leftMenu);
      TextView listItem = (TextView) row.findViewById(R.id.listItem_leftMenu);

      switch (item) {
      case USER_NAME:
        img_left.setImageResource(R.drawable.ic_drive_owned_by_me);
        break;

      case USER_REMOTE_DATA:
        img_left.setImageResource(R.drawable.ic_drive_my_drive);
        break;

      case USER_LOCAL_DATA:
        img_left.setImageResource(R.drawable.ic_type_folder);
        break;

      case USER_DOWNLOADING_DATA:
        img_left.setImageResource(R.drawable.ic_type_zip);
        break;

      default:
        break;
      }

      listItem.setText(item.getMenuName());

      return row;
    }
  }

  private MainActivity mainActivity;

  private ArrayList<MenuTypeEnum> MENULIST = new ArrayList<MenuTypeEnum>();

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    mainActivity = (MainActivity) getActivity();

    for (MenuTypeEnum type : MenuTypeEnum.values()) {
      MENULIST.add(type);
    }

    setListAdapter(new LeftMenuAdapter(getActivity(), R.layout.row_leftmenu, 0, MENULIST));
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    return inflater.inflate(R.layout.fragment_leftmenu, container, false);
  }

  @Override
  public void onListItemClick(ListView l, View v, int position, long id) {
    LeftMenuFragment.MenuTypeEnum menuTypeEnum = (LeftMenuFragment.MenuTypeEnum) v.getTag();

    FragmentTransaction fragmentTransaction;
    switch (menuTypeEnum) {
    case USER_NAME:
      // TODO
      Toast.makeText(mainActivity, "1", Toast.LENGTH_SHORT).show();
      break;

    case USER_REMOTE_DATA:
      fragmentTransaction = mainActivity.getFragmentManager().beginTransaction();
      fragmentTransaction.replace(R.id.contentLayout, new DataListFragment());
      fragmentTransaction.commit();
      break;

    case USER_LOCAL_DATA:
      fragmentTransaction = mainActivity.getFragmentManager().beginTransaction();
      fragmentTransaction.replace(R.id.contentLayout, new LocalResFragment());
      fragmentTransaction.commit();
      break;

    case USER_DOWNLOADING_DATA:
      // TODO
      Toast.makeText(mainActivity, "3", Toast.LENGTH_SHORT).show();
      break;

    default:
      break;
    }

    mainActivity.hideLeftMenuLayout();
  }
}
