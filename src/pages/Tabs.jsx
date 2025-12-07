import { Tab, Tabs } from "@/components/Tabs";

function DemoTabs() {
    return (
        <div>
            <h1>DemoTabs</h1>
            <Tabs>
                <Tab title="Tab #1">
                    <p>Content #1</p>
                    <input type="text" />
                </Tab>
                <Tab title="Tab #2">
                    <p>Content #2</p>
                </Tab>
                <Tab title="Tab #3">
                    <p>Content #3</p>
                </Tab>
            </Tabs>
        </div>
    );
}

export default DemoTabs;
