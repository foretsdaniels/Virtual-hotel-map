import { useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { AreaDetail } from '../components/detail/AreaDetail';

export function AreaPage() {
  const { areaId } = useParams<{ areaId: string }>();
  const getAreaById = useStore(s => s.getAreaById);
  const area = areaId ? getAreaById(areaId) : undefined;

  if (!area) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-display font-bold text-navy mb-2">Area Not Found</h1>
        <p className="text-muted">Area "{areaId}" does not exist.</p>
      </div>
    );
  }

  return <AreaDetail area={area} />;
}
