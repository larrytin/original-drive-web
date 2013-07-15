package com.goodow.drive.android.fragment;

import com.goodow.drive.android.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;

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
      View row = convertView;
      if (null == row) {
        row = ((Activity) this.getContext()).getLayoutInflater().inflate(R.layout.row_leftmenu, parent, false);
      }

      MenuTypeEnum item = getItem(position);
      row.setTag(item);

      TextView listItem = (TextView) row.findViewById(R.id.listItem_leftMenu);
      listItem.setText(item.getMenuName());

      ImageView img_left = (ImageView) row.findViewById(R.id.leftImage_leftMenu);

      switch (item) {
      case USER_NAME:
        listItem.setText(GlobalDataCacheForMemorySingleton.getInstance().getUserName());
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
      fragmentTransaction.replace(R.id.contentLayout, mainActivity.getDataListFragment());
      fragmentTransaction.commit();
      break;

    case USER_LOCAL_DATA:
      fragmentTransaction = mainActivity.getFragmentManager().beginTransaction();
      fragmentTransaction.replace(R.id.contentLayout, mainActivity.getLocalResFragment());
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
