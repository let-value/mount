# mount

Module for listing, mounting and unmounting media devices

Direct port of [mount.py](https://github.com/vallentin/mount.py)

## Install

package.json

```json
{
    "dependencies": {
        "mount": "git://github.com/let-value/mount.git"
    }
}
```

## Usage

Library relies on system calls, which in turn some **require superuser** access.

When listing media devices library queries and parses /proc/partitions. When getting partitions fdisk is queried. Last for not least mkdir and mount is used for mounting, follow by umount used for unmounting.

```javascript
import {
    list,
    get_device_name,
    get_device_block_path,
    get_media_path,
    get_partition,
    is_mounted,
    mount_partition,
    unmount_partition,
    mount,
    unmount,
    is_removable,
    get_size,
    get_model,
    get_vendor
} from "mount";
```

## [Examples](https://github.com/vallentin/mount.py/blob/master/README.md#examples-1)

## [API Reference](https://github.com/vallentin/mount.py/blob/master/README.md#api-reference)
