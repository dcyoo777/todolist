# todolist
React Native 로 개발한 TODO list 애플리케이션

## 사용 모듈
### react-native-gesture-handler
Swipeable 을 사용하기 위해 사용. Android 디바이스에서 사용하기 위해 MainActivity.java 파일에 다음 코드를 추가해야한다.
```java
package com.todo2;

import com.facebook.react.ReactActivity;

+ import com.facebook.react.ReactActivityDelegate;
+ import com.facebook.react.ReactRootView;
+ import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "todo2";
  }

+ @Override
+ protected ReactActivityDelegate createReactActivityDelegate() {
+   return new ReactActivityDelegate(this, getMainComponentName()) {
+     @Override
+     protected ReactRootView createRootView() {
+       return new
+         RNGestureHandlerEnabledRootView(MainActivity.this);
+     }
+   };
+ }
}

```


### react-native-async-storage

### react-native-sqlite-storage

### realm
