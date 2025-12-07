/* eslint-disable react/prop-types */
import clsx from "clsx";
import styles from "./Tabs.module.scss";

function Tab({ title, active = false, onClick }) {
    return (
        <div
            className={clsx(styles.tabItem, { [styles.active]: active })}
            onClick={onClick}
        >
            {title}
        </div>
    );
}

export default Tab;
