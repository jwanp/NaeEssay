import Essays from './Essays';
import SideBar from './sideBar';

export default function Write() {
    return (
        <div className="max-w-7xl min-h-screen py-2 flex flex-col md:flex-row mx-auto">
            <SideBar></SideBar>
            <Essays></Essays>
        </div>
    );
}
