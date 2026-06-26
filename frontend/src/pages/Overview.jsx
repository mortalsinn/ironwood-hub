import KPICards from '../components/KPICards';
import DashboardGrid from '../components/DashboardGrid';

export default function Overview({ data, keyword }) {
  return (
    <div className="space-y-6">
      <KPICards data={data} />
      <DashboardGrid data={data} keyword={keyword} />
    </div>
  );
}
