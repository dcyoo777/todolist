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
realm의 데이터가 object여서 그대로 view 구성을 위한 데이터로 사용하는 중 데이터를 삭제하면 해당 view에서 오류를 일으킨다. 
이에 view를 구성하는 데이터는 얕은 복사 후 저장하여 realm에서 데이터가 삭제되어도 view에 영향을 주지 않도록 했다.!
[Uploading Simulator Screen Shot - iPhone 12 - 2021-07-01 at 18.13.12.png…]()
```javascript
const allData = realm.objects("Task");

const a = allData.map((data) => {
  return {
    id: data.id,
    task: data.task,
    done: data.done,
  }
})

setData(a);
```
