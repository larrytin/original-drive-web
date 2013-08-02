package com.goodow.drive.android.fragment;

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
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import com.goodow.android.drive.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.global_data_cache.GlobalConstant;
import com.goodow.drive.android.global_data_cache.GlobalConstant.MenuTypeEnum;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;

public class LeftMenuFragment extends ListFragment {
	private class LeftMenuAdapter extends ArrayAdapter<MenuTypeEnum> {
		/**
		 * @param context
		 * @param resource
		 * @param textViewResourceId
		 * @param objects
		 */
		public LeftMenuAdapter(Context context, int resource,
				int textViewResourceId, List<MenuTypeEnum> objects) {
			super(context, resource, textViewResourceId, objects);

		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			View row = convertView;
			if (null == row) {
				row = ((Activity) this.getContext()).getLayoutInflater()
						.inflate(R.layout.row_leftmenu, parent, false);

			}

			MenuTypeEnum item = getItem(position);
			row.setTag(item);

			TextView listItem = (TextView) row
					.findViewById(R.id.listItem_leftMenu);
			listItem.setText(item.getMenuName());

			ImageView img_left = (ImageView) row
					.findViewById(R.id.leftImage_leftMenu);

			switch (item) {
			case USER_NAME:
				listItem.setText(GlobalDataCacheForMemorySingleton
						.getInstance().getUserName());
				img_left.setImageResource(R.drawable.ic_drive_owned_by_me);

				break;
			case USER_REMOTE_DATA:
				img_left.setImageResource(R.drawable.ic_drive_my_drive);

				break;
			case USER_LESSON_DATA:
				img_left.setImageResource(R.drawable.ic_type_folder);

				break;
			case USER_OFFLINE_DATA:
				img_left.setImageResource(R.drawable.ic_type_zip);

				break;
//			case LOCAL_RES:
//				img_left.setImageResource(R.drawable.ic_type_zip);
//
//				break;
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

		setListAdapter(new LeftMenuAdapter(getActivity(),
				R.layout.row_leftmenu, 0, MENULIST));
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		return inflater.inflate(R.layout.fragment_leftmenu, container, false);
	}

	@Override
	public void onListItemClick(ListView l, View v, int position, long id) {
		MenuTypeEnum menuTypeEnum = (MenuTypeEnum) v.getTag();

		switch (menuTypeEnum) {
		case USER_NAME:
			// TODO

			break;
		case USER_REMOTE_DATA:
			String favoritesDocId = "@tmp/"
					+ GlobalDataCacheForMemorySingleton.getInstance()
							.getUserId()
					+ "/"
					+ GlobalConstant.DocumentIdAndDataKey.FAVORITESDOCID
							.getValue();
			mainActivity.getRemoteControlObserver().changeMapItem(
					favoritesDocId);

			// FragmentTransaction fragmentTransaction1;
			// fragmentTransaction1 = mainActivity.getFragmentManager()
			// .beginTransaction();
			// fragmentTransaction1.replace(R.id.contentLayout,
			// mainActivity.getDataListFragment());
			// fragmentTransaction1.commit();

			break;
		case USER_LESSON_DATA:
			String lessonDocId = "@tmp/"
					+ GlobalDataCacheForMemorySingleton.getInstance()
							.getUserId()
					+ "/"
					+ GlobalConstant.DocumentIdAndDataKey.LESSONDOCID
							.getValue();
			mainActivity.getRemoteControlObserver().changeMapItem(lessonDocId);

			// FragmentTransaction fragmentTransaction2;
			// fragmentTransaction2 = mainActivity.getFragmentManager()
			// .beginTransaction();
			// fragmentTransaction2.replace(R.id.contentLayout,
			// mainActivity.getLessonListFragment());
			// fragmentTransaction2.commit();

			break;
		case USER_OFFLINE_DATA:
			String offlineDocId = "@tmp/"
					+ GlobalDataCacheForMemorySingleton.getInstance()
							.getUserId()
					+ "/"
					+ GlobalConstant.DocumentIdAndDataKey.OFFLINEDOCID
							.getValue();
			mainActivity.getRemoteControlObserver().changeMapItem(offlineDocId);

			// FragmentTransaction fragmentTransaction3;
			// fragmentTransaction3 = mainActivity.getFragmentManager()
			// .beginTransaction();
			// fragmentTransaction3.replace(R.id.contentLayout,
			// mainActivity.getOfflineListFragment());
			// fragmentTransaction3.commit();

			break;
		// case LOCAL_RES:
		// FragmentTransaction fragmentTransaction;
		// fragmentTransaction = mainActivity.getFragmentManager()
		// .beginTransaction();
		// fragmentTransaction.replace(R.id.contentLayout,
		// mainActivity.getLocalResFragment());
		// fragmentTransaction.commit();
		//
		// break;
		default:

			break;
		}

		mainActivity.hideLeftMenuLayout();
		mainActivity.setDataDetailLayoutState(View.INVISIBLE);
	}

	public void hiddenView() {
		View view = getView();
		Animation out = AnimationUtils.makeOutAnimation(getActivity(), false);
		view.startAnimation(out);
		view.setVisibility(View.INVISIBLE);
	}

	public void showView() {
		View view = getView();
		Animation in = AnimationUtils.makeInAnimation(getActivity(), true);
		view.startAnimation(in);
		view.setVisibility(View.VISIBLE);
	}
}
