package com.goodow.drive.android.activity;

import roboguice.activity.RoboActivity;
import roboguice.inject.ContentView;
import roboguice.inject.InjectView;
import android.app.ActionBar;
import android.app.AlertDialog;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.goodow.android.drive.R;
import com.goodow.drive.android.Interface.IRemoteControl;
import com.goodow.drive.android.Interface.ILocalFragment;
import com.goodow.drive.android.fragment.DataDetailFragment;
import com.goodow.drive.android.fragment.DataListFragment;
import com.goodow.drive.android.fragment.LeftMenuFragment;
import com.goodow.drive.android.fragment.LessonListFragment;
import com.goodow.drive.android.fragment.LocalResFragment;
import com.goodow.drive.android.fragment.OfflineListFragment;
import com.goodow.drive.android.global_data_cache.GlobalConstant;
import com.goodow.drive.android.global_data_cache.GlobalConstant.DocumentIdAndDataKey;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.drive.android.toolutils.ToolsFunctionForThisProgect;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.Document;
import com.goodow.realtime.DocumentLoadedHandler;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.Model;
import com.goodow.realtime.ModelInitializerHandler;
import com.goodow.realtime.Realtime;
import com.goodow.realtime.ValueChangedEvent;

import elemental.json.Json;
import elemental.json.JsonArray;
import elemental.json.JsonObject;
import elemental.json.impl.JreJsonString;

@ContentView(R.layout.activity_main)
public class MainActivity extends RoboActivity {
	private final String TAG = this.getClass().getSimpleName();

	private ILocalFragment iRemoteDataFragment;
	private ILocalFragment lastiRemoteDataFragment;

	private RemoteControlObserver remoteControlObserver;
	private ActionBar actionBar;

	@InjectView(R.id.leftMenuLayout)
	private LinearLayout leftMenu;
	@InjectView(R.id.middleLayout)
	private LinearLayout middleLayout;
	@InjectView(R.id.dataDetailLayout)
	private LinearLayout dataDetailLayout;

	private TextView openFailure_text;
	private ImageView openFailure_img;

	private LeftMenuFragment leftMenuFragment = new LeftMenuFragment();
	private DataListFragment dataListFragment = new DataListFragment();
	private LocalResFragment localResFragment = new LocalResFragment();
	private OfflineListFragment offlineListFragment = new OfflineListFragment();
	private DataDetailFragment dataDetailFragment = new DataDetailFragment();
	private LessonListFragment lessonListFragment = new LessonListFragment();

	public LocalResFragment getLocalResFragment() {

		return localResFragment;
	}

	public DataDetailFragment getDataDetailFragment() {
		return dataDetailFragment;
	}

	public void hideLeftMenuLayout() {
		if (null != leftMenu && null != middleLayout) {
			leftMenuFragment.hiddenView();

			Animation out = AnimationUtils.makeOutAnimation(this, false);
			out.setAnimationListener(new AnimationListener() {
				@Override
				public void onAnimationStart(Animation animation) {
				}

				@Override
				public void onAnimationRepeat(Animation animation) {
				}

				@Override
				public void onAnimationEnd(Animation animation) {
					leftMenu.setVisibility(LinearLayout.INVISIBLE);
					middleLayout.setVisibility(LinearLayout.INVISIBLE);
					setLeftMenuLayoutX(0);// 重置其位置,防止负数循环叠加
					setLeftMenuLayoutX(-leftMenu.getWidth());

				}
			});

			leftMenu.startAnimation(out);

		}
	}

	private void showLeftMenuLayout() {
		Animation in = AnimationUtils.makeInAnimation(this, true);
		leftMenu.startAnimation(in);
		leftMenu.setVisibility(LinearLayout.VISIBLE);
		leftMenuFragment.showView();

	}

	private void setLeftMenuLayoutX(int x) {
		leftMenu.layout(x, leftMenu.getTop(), leftMenu.getRight(),
				leftMenu.getBottom());
		Log.i("Scorll", "set:" + leftMenu.getLeft());
	}

	public void setDataDetailLayoutState(int state) {
		if (dataDetailLayout.getVisibility() != state) {
			Animation animation;

			if (state == View.VISIBLE) {
				animation = AnimationUtils.makeInAnimation(this, false);

			} else {
				animation = AnimationUtils.makeOutAnimation(this, true);

			}

			dataDetailLayout.startAnimation(animation);
			dataDetailLayout.setVisibility(state);
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);

		MenuItem back2Login = menu.add(0, 0, 0, R.string.actionBar_back);
		back2Login.setIcon(R.drawable.discussion_indicator_opened);
		back2Login.setShowAsAction(MenuItem.SHOW_AS_ACTION_IF_ROOM);

		return true;
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK && null != iRemoteDataFragment) {
			iRemoteDataFragment.backFragment();

			return true;
		}

		return super.onKeyDown(keyCode, event);
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		super.onOptionsItemSelected(item);

		if (item.getItemId() == android.R.id.home) {
			if (leftMenu.getVisibility() == LinearLayout.VISIBLE) {
				hideLeftMenuLayout();

			} else {
				setLeftMenuLayoutX(0);
				showLeftMenuLayout();
				middleLayout.setVisibility(LinearLayout.VISIBLE);

			}

		} else if (item.getItemId() == 0) {
			AlertDialog alertDialog = new AlertDialog.Builder(this)
					.setPositiveButton(R.string.dailogOK,
							new DialogInterface.OnClickListener() {

								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									GlobalDataCacheForMemorySingleton.getInstance
											.setUserId(null);
									GlobalDataCacheForMemorySingleton.getInstance
											.setAccess_token(null);

									// Intent intent = new Intent(
									// MainActivity.this,
									// LogInActivity.class);
									// startActivity(intent);

									// finish();
									ToolsFunctionForThisProgect
											.quitApp(MainActivity.this);
								}
							})
					.setNegativeButton(R.string.dailogCancel,
							new DialogInterface.OnClickListener() {

								@Override
								public void onClick(DialogInterface dialog,
										int which) {

								}
							}).setMessage(R.string.back_DailogMessage).create();

			alertDialog.show();
		}

		return true;
	}

	public void setActionBarTitle(String title) {
		actionBar.setTitle(title);

	}

	public void restActionBarTitle() {
		actionBar.setTitle(R.string.app_name);

	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// GlobalDataCacheForMemorySingleton.getInstance.addActivity(this);

		actionBar = getActionBar();
		actionBar.setDisplayHomeAsUpEnabled(true);

		FragmentManager fragmentManager = getFragmentManager();
		fragmentManager.popBackStack();

		FragmentTransaction fragmentTransaction = fragmentManager
				.beginTransaction();
		fragmentTransaction.replace(R.id.dataDetailLayout, dataDetailFragment);
		fragmentTransaction.replace(R.id.leftMenuLayout, leftMenuFragment);

		fragmentTransaction.commitAllowingStateLoss();

		middleLayout.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				hideLeftMenuLayout();

			}
		});

		String docId = "@tmp/"
				+ GlobalDataCacheForMemorySingleton.getInstance().getUserId()
				+ "/"
				+ GlobalConstant.DocumentIdAndDataKey.REMOTECONTROLDOCID
						.getValue();

		remoteControlObserver = new RemoteControlObserver();
		remoteControlObserver.startObservation(docId);

	}

	@Override
	protected void onRestart() {
		Log.i(TAG, "onRestart");
		super.onRestart();
	}

	@Override
	protected void onStart() {
		Log.i(TAG, "onStart");
		super.onStart();
	}

	@Override
	protected void onResume() {
		Log.i(TAG, "onResume");
		super.onResume();
	}

	@Override
	protected void onPause() {
		Log.i(TAG, "onPause");
		super.onPause();
	}

	@Override
	protected void onStop() {
		Log.i(TAG, "onStop");
		super.onStop();
	}

	@Override
	protected void onDestroy() {
		Log.i(TAG, "onDestroy");
		super.onDestroy();
	}

	public void setIRemoteFrament(ILocalFragment iRemoteDataFragment) {
		this.iRemoteDataFragment = iRemoteDataFragment;

	}

	public ILocalFragment getLastiRemoteDataFragment() {

		return lastiRemoteDataFragment;
	}

	public void setLastiRemoteDataFragment(
			ILocalFragment lastiRemoteDataFragment) {
		this.lastiRemoteDataFragment = lastiRemoteDataFragment;

	}

	public void openState(int visibility) {
		if (null != openFailure_text) {
			openFailure_text.setVisibility(visibility);

		}

		if (null != openFailure_img) {
			openFailure_img.setVisibility(visibility);

		}
	}

	public void setOpenStateView(TextView textView, ImageView imageView) {
		openFailure_text = textView;
		openFailure_img = imageView;

	}

	private void switchFragment(DocumentIdAndDataKey doc) {
		if (null != doc) {
			Fragment newFragment = null;

			switch (doc) {
			case LESSONDOCID:
				newFragment = lessonListFragment;

				break;
			case FAVORITESDOCID:
				newFragment = dataListFragment;

				break;
			case OFFLINEDOCID:
				newFragment = offlineListFragment;

				break;
			default:
				break;
			}

			if (newFragment != null) {
				FragmentManager fragmentManager = getFragmentManager();
				fragmentManager.popBackStack();

				FragmentTransaction fragmentTransaction = fragmentManager
						.beginTransaction();
				fragmentTransaction.replace(R.id.contentLayout, newFragment);
				fragmentTransaction.commitAllowingStateLoss();
			}
		}
	}

	public IRemoteControl getRemoteControlObserver() {

		return remoteControlObserver;
	}

	public class RemoteControlObserver implements IRemoteControl {
		private Document doc;
		private Model model;
		private CollaborativeMap root;
		private JsonObject map;

		private EventHandler<ValueChangedEvent> lastHandler;

		@Override
		public JsonArray getCurrentPath() {
			if (null != map) {
				return map
						.get(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
								.getValue());
			}
			return null;
		}

		@Override
		public void changeDoc(String docId) {
			root.removeValueChangedListener(lastHandler);

			JsonObject map = Json.createObject();
			JsonArray jsonArray = Json.createArray();

			map.put(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
					.getValue(), jsonArray);
			map.put(GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
					.getValue(), docId);

			root.set(GlobalConstant.DocumentIdAndDataKey.PATHKEY.getValue(),
					map);

			freshMap();

			Log.i(TAG, "Change DocId: " + docId);
		}

		@Override
		public void addPath(String mapId) {
			if (null != map) {
				JsonArray jsonArray = map
						.get(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
								.getValue());
				jsonArray.set(jsonArray.length(), mapId);
				JsonArray newJsonArray = Json.createArray();
				for (int i = 0; i < jsonArray.length(); i++) {
					String toString = jsonArray.get(i).asString();
					newJsonArray.set(newJsonArray.length(), toString);
				}

				String newString = map.get(
						GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
								.getValue()).asString();

				JsonObject newMap = Json.createObject();
				newMap.put(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
						.getValue(), newJsonArray);
				newMap.put(GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
						.getValue(), newString);

				root.set(
						GlobalConstant.DocumentIdAndDataKey.PATHKEY.getValue(),
						newMap);

				freshMap();
			}
		}

		@Override
		public void removeLastPath() {
			if (null != map) {
				JsonArray jsonArray = map
						.get(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
								.getValue());
				jsonArray.remove(jsonArray.length() - 1);
				JsonArray newJsonArray = Json.createArray();
				for (int i = 0; i < jsonArray.length(); i++) {
					String newString = jsonArray.get(i).asString();
					newJsonArray.set(newJsonArray.length(), newString);
				}

				String newString = map.get(
						GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
								.getValue()).asString();

				JsonObject newMap = Json.createObject();
				newMap.put(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
						.getValue(), newJsonArray);
				newMap.put(GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
						.getValue(), newString);

				root.set(
						GlobalConstant.DocumentIdAndDataKey.PATHKEY.getValue(),
						newMap);

				freshMap();
			}
		}

		@Override
		public void freshMap() {
			if (null != root) {
				map = root.get(GlobalConstant.DocumentIdAndDataKey.PATHKEY
						.getValue());
			}
		}

		@Override
		public void addListener(
				EventHandler<ValueChangedEvent> pathChangeEventHandler) {
			if (null != root) {
				lastHandler = pathChangeEventHandler;
				root.addValueChangedListener(lastHandler);
			}
		}

		@Override
		public String getMapId(int index) {
			String toString = "";
			if (null != map) {
				JsonArray jsonArray = map
						.get(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
								.getValue());

				if (null != jsonArray && jsonArray.length() > 0) {
					toString = jsonArray.get(index).asString();
				}
			}
			return toString;
		}

		private void startObservation(String docId) {
			DocumentLoadedHandler onLoaded = new DocumentLoadedHandler() {
				@Override
				public void onLoaded(Document document) {
					doc = document;
					model = doc.getModel();
					root = model.getRoot();
					freshMap();

					JreJsonString jreJsonString = (JreJsonString) (map
							.get(GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
									.getValue()));

					if (null != jreJsonString) {
						String lastDocId = jreJsonString.asString();

						lastDocId = lastDocId.substring(
								lastDocId.lastIndexOf("/") + 1,
								lastDocId.length());

						DocumentIdAndDataKey doc = DocumentIdAndDataKey
								.getEnumWithValue(lastDocId);

						switchFragment(doc);
					}

					root.addValueChangedListener(new EventHandler<ValueChangedEvent>() {
						@Override
						public void handleEvent(ValueChangedEvent event) {
							String property = event.getProperty();
							if (GlobalConstant.DocumentIdAndDataKey.PATHKEY
									.getValue().equals(property)) {
								JsonObject newJson = (JsonObject) event
										.getNewValue();

								String newDocId = ((JreJsonString) (newJson
										.get(GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
												.getValue()))).asString();

								newDocId = newDocId.substring(
										newDocId.lastIndexOf("/") + 1,
										newDocId.length());

								DocumentIdAndDataKey doc = DocumentIdAndDataKey
										.getEnumWithValue(newDocId);

								switchFragment(doc);

							}
						}
					});
				}
			};

			ModelInitializerHandler initializer = new ModelInitializerHandler() {
				@Override
				public void onInitializer(Model model_) {
					model = model_;
					root = model.getRoot();

					JsonObject jsonObject = Json.createObject();
					root.set(GlobalConstant.DocumentIdAndDataKey.PATHKEY
							.getValue(), jsonObject);
				}
			};

			Realtime.load(docId, onLoaded, initializer, null);
		}

	}

	private float startPoint = 0;

	@Override
	public boolean onTouchEvent(MotionEvent event) {
		switch (event.getAction()) {
		case MotionEvent.ACTION_DOWN:
			if (leftMenu.getVisibility() == View.INVISIBLE) {
				showLeftMenuLayout();
			}
			Log.i("Scorll", "DOWN:" + leftMenu.getLeft());
			startPoint = event.getX();

			break;
		case MotionEvent.ACTION_UP:
			Log.i("Scorll", "UP:" + leftMenu.getLeft());
			if (Math.abs(leftMenu.getLeft()) > leftMenu.getWidth() / 4) {
				hideLeftMenuLayout();

			} else {
				setLeftMenuLayoutX(0);
				middleLayout.setVisibility(View.VISIBLE);

			}

			startPoint = 0;

			break;
		case MotionEvent.ACTION_MOVE:
			do {
				if (startPoint >= event.getX()) {
					break;
				}

				if (leftMenu.getLeft() >= 0) {
					break;
				}

				int add = leftMenu.getLeft() + 4;
				if (add < 0) {
					setLeftMenuLayoutX(add);

				} else {
					setLeftMenuLayoutX(0);

				}

				if (leftMenu.getLeft() >= 0) {
					middleLayout.setVisibility(View.VISIBLE);

				}
			} while (false);

			break;
		default:

			break;
		}

		return true;
	}

}
