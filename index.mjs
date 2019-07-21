import { readFileSync, lstatSync, realpathSync, existsSync } from "fs"
import { basename } from "path"
import { execSync } from "child_process"

export const list = () =>
    readFileSync("/proc/partitions", "utf8")
        .split(/\r?\n/)
        .slice(2)
        .map(line => line.split(/\s+/))
        .map(words => [parseInt(words[2]), words[4]])
        .filter(([number, name]) => {
            const path = "/sys/class/block/" + name
            if (
                number % 16 == 0 &&
                lstatSync(path).isSymbolicLink() &&
                realpathSync(path).includes("/usb")
            )
                return true

            return false
        })
        .map(([_, name]) => "/dev/" + name)

export const get_device_name = device => basename(device)

export const get_device_block_path = device =>
    "/sys/block/" + get_device_name(device)

export const get_media_path = device => "/media/" + get_device_name(device)

export const get_partition = device =>
    execSync("fdisk -l " + device)
        .toString()
        .split(/\r?\n/)
        .slice(-2)[0]
        .split(/\s+/)[0]
        .trim()

export const is_mounted = device =>
    readFileSync("/proc/mounts", "utf8")
        .split(/\r?\n/)
        .filter(line => line.includes(device)).length > 0

export const mount_partition = (partition, name = "usb") => {
    let path = get_media_path(name)
    if (!is_mounted(path)) {
        execSync(`mkdir -p ${path}`)
        execSync(`mount ${partition} ${path}`)
    }
}

export const unmount_partition = (name = "usb") => {
    let path = get_media_path(name)
    if (is_mounted(path)) execSync(`umount ${path}`)
    //rm -rf path
}

export const mount = (device, name = null) =>
    mount_partition(get_partition(device), name || get_device_name(device))

export const unmount = (device, name = null) =>
    unmount_partition(name || get_device_name(device))

export const is_removable = device => {
    let path = get_device_block_path(device) + "/removable"
    if (existsSync(path)) return readFileSync(path, "utf8").trim() == "1"
    return false
}

export const get_size = device => {
    let path = get_device_block_path(device) + "/size"
    if (existsSync(path))
        return parseInt(readFileSync(path, "utf8").trim()) * 512
    return -1
}

export const get_model = device => {
    let path = get_device_block_path(device) + "/device/model"
    if (existsSync(path)) return readFileSync(path, "utf8").trim()
    return null
}

export const get_vendor = device => {
    let path = get_device_block_path(device) + "/device/vendor"
    if (existsSync(path)) return readFileSync(path, "utf8").trim()
    return null
}

export default function main() {
    list().forEach(device => {
        mount(device)

        console.log("Drive:", get_device_name(device))
        console.log("Mounted:", is_mounted(device) ? "Yes" : "No")
        console.log("Removable:", is_removable(device) ? "Yes" : "No")
        console.log("Size:", get_size(device), "bytes")
        console.log("Size:", get_size(device) / Math.pow(1024, 3), "GB")
        console.log("Model:", get_model(device))
        console.log("Vendor:", get_vendor(device))
        console.log(" ")

        unmount(device)
    })
}