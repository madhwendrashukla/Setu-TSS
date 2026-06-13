import { AutomatedVideoPromo } from '../ui/AutomatedVideoPromo';

export function Hero({ data, slides }: { data?: any, slides?: any[] }) {
    return (
        <AutomatedVideoPromo data={data} slides={slides} />
    );
}
