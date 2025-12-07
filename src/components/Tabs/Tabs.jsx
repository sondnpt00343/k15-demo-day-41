/* eslint-disable react/prop-types */
import { Children, useState } from "react";
import styles from "./Tabs.module.scss";
import { Tab } from ".";

function Tabs({ keepContent = false, children, defaultTabIndex = 0 }) {
    const [tabIndex, setTabIndex] = useState(defaultTabIndex);
    const tabs = Children.map(children, (child) => child);

    const currentTab = tabs[tabIndex];

    const renderContent = () => {
        if (keepContent) {
            return tabs.map((tab, index) => (
                <div key={index} hidden={index !== tabIndex}>
                    {tab.props.children}
                </div>
            ));
        }
        return currentTab.props.children;
    };

    return (
        <div className={styles.tabs}>
            <div className={styles.tabList}>
                {tabs.map((child, index) => (
                    <Tab
                        key={index}
                        active={tabIndex === index}
                        title={child.props.title}
                        onClick={() => {
                            setTabIndex(index);
                        }}
                    />
                ))}
            </div>
            <div className={styles.tabContent}>{renderContent()}</div>
        </div>
    );
}

export default Tabs;
