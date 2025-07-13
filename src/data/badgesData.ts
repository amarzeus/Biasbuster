
import { Badge } from '../types';
import {
    AwardIcon,
    BookCheckIcon,
    SparklesIcon,
    TargetIcon,
    ThumbUpIcon,
    TrendingUpIcon,
    TrophyIcon
} from '../components/icons/Icons';

export const allBadges: Badge[] = [
    {
        id: 'first_analysis',
        name: 'First Step',
        description: 'Perform your very first analysis.',
        icon: SparklesIcon,
    },
    {
        id: 'analyst_5',
        name: 'Apprentice Analyst',
        description: 'Perform 5 analyses.',
        icon: TrendingUpIcon,
    },
    {
        id: 'analyst_20',
        name: 'Senior Analyst',
        description: 'Perform 20 analyses.',
        icon: AwardIcon,
    },
    {
        id: 'feedback_1',
        name: 'Contributor',
        description: 'Provide feedback on an analysis finding.',
        icon: ThumbUpIcon,
    },
    {
        id: 'feedback_10',
        name: 'Super Contributor',
        description: 'Provide feedback 10 times to help improve the AI.',
        icon: TargetIcon,
    },
    {
        id: 'quiz_taker',
        name: 'Knowledge Seeker',
        description: 'Complete the bias knowledge quiz for the first time.',
        icon: BookCheckIcon,
    },
    {
        id: 'quiz_master',
        name: 'Bias Master',
        description: 'Get a perfect score on the bias knowledge quiz.',
        icon: TrophyIcon,
    },
];
